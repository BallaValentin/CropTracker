package com.edu.bbte.allamvizsga.services;

import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.rmi.server.UID;
import java.util.Collection;
import java.util.Optional;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public void createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public Collection<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findUserById(UID uid) {
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
