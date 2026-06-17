package edu.bbte.allamvizsga.services;

import edu.bbte.allamvizsga.exceptions.BadRequestException;
import edu.bbte.allamvizsga.exceptions.InvalidSignupException;
import edu.bbte.allamvizsga.model.Role;
import edu.bbte.allamvizsga.model.User;
import edu.bbte.allamvizsga.model.VerifyEmailToken;
import edu.bbte.allamvizsga.repository.RoleRepository;
import edu.bbte.allamvizsga.repository.UserRepository;
import edu.bbte.allamvizsga.repository.VerifyEmailTokenRepository;
import edu.bbte.allamvizsga.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ImageService imageService;
    private final JwtUtil jwtUtil;
    private final VerifyEmailTokenRepository verifyEmailTokenRepository;

    public void createUser(User user, Boolean isGrower, Boolean isWorker) {

        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new InvalidSignupException("Username already taken.");
        }

        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new InvalidSignupException("Email address already taken.");
        }

        if (!isGrower && !isWorker) {
            throw new InvalidSignupException("No roles have been chosen.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(new ArrayList<>());

        if (isGrower) {
            Optional<Role> farmerRole = roleRepository.findByName("GROWER");
            if (farmerRole.isEmpty()) {
                throw new RuntimeException("Role not found.");
            }
            user.getRoles().add(farmerRole.get());
        }

        if (isWorker) {
            Optional<Role> dayLaborerRole = roleRepository.findByName("WORKER");
            if (dayLaborerRole.isEmpty()) {
                throw new RuntimeException("Role not found.");
            }
            user.getRoles().add(dayLaborerRole.get());
        }

        userRepository.save(user);
    }

    public Collection<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findUserById(UUID userId) {
        User user = userRepository.findByUid(userId);
        if (user == null) {
            throw new EntityNotFoundException("User not found.");
        } else {
            return user;
        }
    }

    public User findUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new EntityNotFoundException("User not found.");
        } else {
            return user;
        }
    }

    public User findUserByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new EntityNotFoundException("User not found.");
        } else {
            return user;
        }
    }

    public User authenticate(User user) {
        User foundUser = userRepository.findByUsername(user.getUsername());
        if (foundUser != null) {
            if (passwordEncoder.matches(user.getPassword(), foundUser.getPassword()) &&
            foundUser.getIsActive() && foundUser.getIsVerified()) {
                return foundUser;
            } else {
                throw new BadCredentialsException("Invalid username or password.");
            }
        } else {
            throw new BadCredentialsException("Invalid username or password.");
        }
    }

    public void verifyAccount(String email, String verificationCode) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new EntityNotFoundException("User not found.");
        }

        VerifyEmailToken verifyEmailToken =
                verifyEmailTokenRepository.findByVerificationCode(verificationCode);

        if (verifyEmailToken == null) {
            throw new EntityNotFoundException(
                    "Account verification token not found. Please try with a different verification code.");
        }

        if (Instant.now().isAfter(verifyEmailToken.getExpires())) {
            verifyEmailTokenRepository.deleteById(verifyEmailToken.getUid());
            throw new InvalidSignupException("Account verification token has expired");
        }

        user.setIsVerified(Boolean.TRUE);
        userRepository.save(user);

        verifyEmailTokenRepository.deleteById(verifyEmailToken.getUid());

        imageService.uploadDefaultImage(user);
    }

    public void changeAvatar(User user, String newImageSrc) {
        imageService.updateUserAvatar(user, newImageSrc);
    }

    public void updateUser(User user, String newAvatar) {
        if (newAvatar != null && !newAvatar.isBlank()) {
            changeAvatar(user, newAvatar);
        }
        userRepository.save(user);
    }

    public void updateUserStatus(User user, Boolean isActive) {
        user.setIsActive(isActive);
        userRepository.save(user);
    }

    public void updateUserRoles(User user, Collection<Role> roles) {
        user.setRoles(roles);
        userRepository.save(user);
    }

    public void updatePassword(User user, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        userRepository.updatePassword(encodedPassword, user.getUid());
    }

    public User extractUser(String authorizationHeader) {
        String accessToken = authorizationHeader.substring(7);
        String uid = jwtUtil.getUid(accessToken);
        try {
            if (uid == null || uid.isBlank()) {
                throw new BadRequestException("The user id is missing");
            }
            UUID userId = UUID.fromString(uid);
            return findUserById(userId);
        } catch (IllegalArgumentException exception) {
            throw new BadRequestException("Invalid user id format");
        }
    }
}
