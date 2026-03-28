package edu.bbte.allamvizsga.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "reset_password_token")
@EqualsAndHashCode(callSuper = true)
@Data
public class ResetPasswordToken extends BaseEntity {
    private Instant expires;
    @ManyToOne
    @JoinColumn(name = "user_uid")
    private User user;

    public ResetPasswordToken(User user) {
        this.user = user;
        this.expires = Instant.now().plus(15, ChronoUnit.MINUTES);
    }

    public ResetPasswordToken() {

    }
}
