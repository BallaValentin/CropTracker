package edu.bbte.allamvizsga.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
public class ErrorResponseDTO {
    private LocalDateTime timestamp;
    private Integer statusCode;
    private String message;
    private String path;
}
