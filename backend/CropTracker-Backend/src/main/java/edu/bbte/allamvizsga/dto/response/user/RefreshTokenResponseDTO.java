package edu.bbte.allamvizsga.dto.response.user;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class RefreshTokenResponseDTO {
    private String accessToken;
}
