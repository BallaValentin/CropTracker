package com.edu.bbte.allamvizsga.services;

import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.rmi.server.UID;
import java.util.Collection;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public Collection<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findUserById(UID uid) {
        return userRepository.getUserByUid(uid);
    }

    public User findUserByUsername(String username) {
        return userRepository.getUserByUsername(username);
    }
}
