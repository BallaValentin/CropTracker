package com.edu.bbte.allamvizsga.security;

import com.edu.bbte.allamvizsga.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Getter
public class UserDetailsImpl implements UserDetails {

    private String username;
    @JsonIgnore
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    private Boolean isEnabled;

    public UserDetailsImpl(String username, String password, Boolean isEnabled, Collection<? extends GrantedAuthority> authorities) {
        this.username = username;
        this.password = password;
        this.authorities = authorities;
        this.isEnabled = isEnabled;
    }

    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        if (user.getFirstName() != null && "ADMIN".equals(user.getRole())) {
            authorities.add(new SimpleGrantedAuthority("Administrator"));
        }
        if (user.getRole() != null && "USER".equals(user.getRole())) {
            authorities.add(new SimpleGrantedAuthority("User"));
        }

        return new UserDetailsImpl(user.getUsername(), user.getPassword(), true, authorities);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
