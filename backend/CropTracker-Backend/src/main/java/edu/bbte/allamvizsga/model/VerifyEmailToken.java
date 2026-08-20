package edu.bbte.allamvizsga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name="verify_email_token")
@Data
@EqualsAndHashCode(callSuper = true)
public class VerifyEmailToken extends BaseEntity{
    private Instant expires;
    @ManyToOne
    @JoinColumn(name = "user_uid")
    private User user;

    private String token;

    @Column(unique = true)
    private String verificationCode;

    public VerifyEmailToken(User user, String token) {
        this.user = user;
        this.token = token;
        this.expires = Instant.now().plus(15, ChronoUnit.MINUTES);
    }

    public VerifyEmailToken() {

    }
}
