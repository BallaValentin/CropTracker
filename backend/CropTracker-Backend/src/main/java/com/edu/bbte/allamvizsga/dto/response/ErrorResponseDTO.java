package com.edu.bbte.allamvizsga.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
public class ErrorResponseDTO {
    private LocalDateTime timestamp;
    private Integer statusCode;
    private String message;
    private String path;
}
