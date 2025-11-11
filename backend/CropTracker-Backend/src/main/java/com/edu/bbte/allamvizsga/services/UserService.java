package com.edu.bbte.allamvizsga.services;

import com.edu.bbte.allamvizsga.dto.request.UserUpdateDTO;
import com.edu.bbte.allamvizsga.exceptions.InvalidSignupException;
import com.edu.bbte.allamvizsga.model.Role;
import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.repository.RoleRepository;
import com.edu.bbte.allamvizsga.repository.UserRepository;
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

    public void createUser(User user, Boolean isFarmer, Boolean isDayLaborer) throws IOException {

        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new InvalidSignupException("User with username " + user.getUsername() + " already exists");
        }

        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new InvalidSignupException("User with email " + user.getEmail() + " already exists");
        }

        if (!isFarmer && !isDayLaborer) {
            throw new InvalidSignupException("One of the roles must be chosen");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(new ArrayList<>());

        if (isFarmer) {
            Optional<Role> farmerRole = roleRepository.findByName("FARMER");
            if (farmerRole.isEmpty()) {
                throw new RuntimeException("Role not found");
            }
            user.getRoles().add(farmerRole.get());
        }

        if (isDayLaborer) {
            Optional<Role> dayLaborerRole = roleRepository.findByName("DAY_LABORER");
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
        log.info("Initiating update");
        UUID uid = user.getUid();
        String newUsername = userUpdates.getUsername();
        String newEmail = userUpdates.getEmail();

        log.info("Processed parameters");

        if (!newUsername.equals(user.getUsername())) {
            log.info("Updating username");
            userRepository.updateUsername(newUsername, uid);
            log.info("Updated username successfully");
        }

        if (!newEmail.equals(user.getEmail())) {
            log.info("Updating email");
            userRepository.updateEmail(newEmail, uid);
            log.info("Updated email successfully");
        }

        log.info("Returning updated user");
        return userRepository.findByUid(uid);
    }

    public void updatePassword(User user, String newPassword) {
        log.info("Updating password...");
        String encodedPassword = passwordEncoder.encode(newPassword);
        userRepository.updatePassword(encodedPassword, user.getUid());
        log.info("The password has been updated");
    }
}
