package com.edu.bbte.allamvizsga.services;

import com.edu.bbte.allamvizsga.exceptions.InvalidSignupException;
import com.edu.bbte.allamvizsga.model.Role;
import com.edu.bbte.allamvizsga.model.User;
import com.edu.bbte.allamvizsga.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Collection;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public void createUser(User user) {

        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new InvalidSignupException("User with username " + user.getUsername() + " already exists");
        }

        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new InvalidSignupException("User with email " + user.getEmail() + " already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.getRoles().add(new Role("ROLE_USER"));
        userRepository.save(user);
    }

    public Collection<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findUserById(UUID uid) {
        return userRepository.findByUid(uid);
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username);
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
}
