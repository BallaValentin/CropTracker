package com.edu.bbte.allamvizsga.services;

import com.edu.bbte.allamvizsga.dto.request.UserUpdateDTO;
import com.edu.bbte.allamvizsga.exceptions.InvalidSignupException;
import com.edu.bbte.allamvizsga.model.Role;
import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.repository.RoleRepository;
import com.edu.bbte.allamvizsga.repository.UserRepository;
import com.edu.bbte.allamvizsga.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
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

    public void createUser(User user, Boolean isGrower, Boolean isWorker) throws IOException {

        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new InvalidSignupException("User with username " + user.getUsername() + " already exists");
        }

        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new InvalidSignupException("User with email " + user.getEmail() + " already exists");
        }

        if (!isGrower && !isWorker) {
            throw new InvalidSignupException("One of the roles must be chosen");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(new ArrayList<>());

        if (isGrower) {
            Optional<Role> farmerRole = roleRepository.findByName("GROWER");
            if (farmerRole.isEmpty()) {
                throw new RuntimeException("Role not found");
            }
            user.getRoles().add(farmerRole.get());
        }

        if (isWorker) {
            Optional<Role> dayLaborerRole = roleRepository.findByName("WORKER");
            if (dayLaborerRole.isEmpty()) {
                throw new RuntimeException("Role not found");
            }
            user.getRoles().add(dayLaborerRole.get());
        }

        userRepository.save(user);
        imageService.uploadDefaultImage(user);
    }

    public Collection<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findUserById(UUID uid) {
        User user = userRepository.findByUid(uid);
        if (user == null) {
            throw new EntityNotFoundException("Couldn't find user");
        } else {
            return user;
        }
    }

    public User findUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new EntityNotFoundException("Couldn't find user with email: " + email);
        } else {
            return user;
        }
    }

    public User findUserByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new EntityNotFoundException("Couldn't find user with username: " + username);
        } else {
            return user;
        }
    }

    public User authenticate(User user) {
        User user1 = userRepository.findByUsername(user.getUsername());
        if (user1 != null) {
            if (passwordEncoder.matches(user.getPassword(), user1.getPassword())) {
                return user1;
            } else {
                throw new BadCredentialsException("Invalid username or password");
            }
        } else {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    public void changeAvatar(User user, String newImageSrc) throws IOException {
        imageService.updateUserAvatar(user, newImageSrc);
    }

    public User updateUser(User user, UserUpdateDTO userUpdates) {
        UUID uid = user.getUid();
        String newUsername = userUpdates.getUsername();
        String newEmail = userUpdates.getEmail();

        if (!newUsername.equals(user.getUsername())) {
            userRepository.updateUsername(newUsername, uid);
        }

        if (!newEmail.equals(user.getEmail())) {
            userRepository.updateEmail(newEmail, uid);
        }

        return userRepository.findByUid(uid);
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
        UUID uid = jwtUtil.getUid(accessToken);
        return findUserById(uid);
    }
}
