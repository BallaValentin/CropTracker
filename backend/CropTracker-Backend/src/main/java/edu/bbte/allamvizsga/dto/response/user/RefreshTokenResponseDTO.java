package edu.bbte.allamvizsga.dto.response.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RefreshTokenResponseDTO {
    private String accessToken;
}
