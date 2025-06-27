package com.edu.bbte.allamvizsga.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
@Slf4j
public class JwtUtil {
    @Value("${JWT_SECRET}")
    private String secret;
    @Value("${JWT_EXPIRATION}")
    private Integer expiration;
    private SecretKey key;

    @PostConstruct
    public void init() {
        log.info("Initializing JWT with secret: {}", secret);
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username) {
        return Jwts.builder().subject(username).issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + expiration))
                .signWith(key, Jwts.SIG.HS256).compact();
    }

    public String getUsername(String token) {
        return Jwts.parser().verifyWith(key)
                .build().parseSignedClaims(token).getPayload().getSubject();
    }

    public Boolean validateToken(String token) {
        log.info("Validating token: {}", token);
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (SecurityException e) {
            log.warn("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.warn("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}
