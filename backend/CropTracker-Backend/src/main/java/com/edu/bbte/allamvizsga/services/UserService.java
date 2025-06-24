package com.edu.bbte.allamvizsga.services;

import com.edu.bbte.allamvizsga.exceptions.InvalidSignupException;
import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.rmi.server.UID;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public void createUser(User user) {

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new InvalidSignupException("User with username " + user.getUsername() + " already exists");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new InvalidSignupException("User with email " + user.getEmail() + " already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        userRepository.save(user);
    }

    public Collection<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findUserById(UUID uid) {
        Optional<User> user = userRepository.findByUid(uid);
        return user.orElse(null);
    }

    public User findUserByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.orElse(null);
    }

    public User login(User user) {
        Optional<User> userOptional = userRepository.findByUid(user.getUid());
        if (userOptional.isPresent()) {
            if (passwordEncoder.matches(user.getPassword(), userOptional.get().getPassword())) {
                return userOptional.get();
            } else {
                throw new BadCredentialsException("Invalid username or password");
            }
        } else {
            throw new BadCredentialsException("Invalid username or password");
        }
    }
}
