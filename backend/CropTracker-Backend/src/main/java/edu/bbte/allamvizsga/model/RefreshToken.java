package edu.bbte.allamvizsga.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "refresh_token")
@Data
public class RefreshToken extends BaseEntity{
    private UUID token;
    private Instant expires;
    @ManyToOne
    @JoinColumn(name = "user_uid")
    private User user;

    public RefreshToken(User user, UUID token) {
        this.user = user;
        this.token = token;
        this.expires = Instant.now().plus(24, ChronoUnit.HOURS);
    }

    public RefreshToken() {

    }
}
