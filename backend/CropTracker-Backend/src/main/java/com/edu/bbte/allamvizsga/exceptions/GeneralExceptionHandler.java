package com.edu.bbte.allamvizsga.exceptions;

import com.edu.bbte.allamvizsga.dto.response.ErrorResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Slf4j
@RestControllerAdvice
public class GeneralExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponseDTO handleBadCredentialsException(
            BadCredentialsException exception, HttpServletRequest request
    ) {
        log.debug("Sign in failed");
        LocalDateTime dateTime = LocalDateTime.now();
        Integer statusCode = HttpStatus.UNAUTHORIZED.value();
        String message = exception.getMessage();
        String path = request.getRequestURI();
        return new ErrorResponseDTO(dateTime, statusCode, message, path);
    }
}
