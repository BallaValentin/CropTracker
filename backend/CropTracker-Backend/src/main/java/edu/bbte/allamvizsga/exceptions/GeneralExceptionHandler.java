package edu.bbte.allamvizsga.exceptions;

import edu.bbte.allamvizsga.dto.response.ErrorResponseDTO;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Slf4j
@RestControllerAdvice
public class GeneralExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponseDTO handleBadCredentialsException(
            BadCredentialsException exception, HttpServletRequest request
    ) {
        log.debug("Sign in failed");
        LocalDateTime dateTime = LocalDateTime.now();
        Integer statusCode = HttpStatus.BAD_REQUEST.value();
        String message = exception.getMessage();
        String path = request.getRequestURI();
        return new ErrorResponseDTO(dateTime, statusCode, message, path);
    }

    @ExceptionHandler(InvalidSignupException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponseDTO handleInvalidSignupException(
            InvalidSignupException exception, HttpServletRequest request
    ) {
        log.debug("Sign up failed");
        LocalDateTime dateTime = LocalDateTime.now();
        Integer statusCode = HttpStatus.BAD_REQUEST.value();
        String message = exception.getMessage();
        String path = request.getRequestURI();
        return new ErrorResponseDTO(dateTime, statusCode, message, path);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorResponseDTO handleMethodArgumentNotValid(
            MethodArgumentNotValidException exception, HttpServletRequest request) {
        LocalDateTime timestamp = LocalDateTime.now();
        Integer statusCode = HttpStatus.BAD_REQUEST.value();
        String error = exception.getBindingResult().getAllErrors().getFirst().getDefaultMessage();
        String path = request.getRequestURI();
        return new ErrorResponseDTO(timestamp, statusCode, error, path);
    }

    @ExceptionHandler(EntityExistsException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorResponseDTO handleEntityExists(
            EntityExistsException exception, HttpServletRequest request) {
        LocalDateTime timestamp = LocalDateTime.now();
        Integer statusCode = HttpStatus.BAD_REQUEST.value();
        String error = exception.getMessage();
        String path = request.getRequestURI();
        return new ErrorResponseDTO(timestamp, statusCode, error, path);
    }

    @ExceptionHandler(InvalidRoleException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorResponseDTO handleInvalidRole(
            InvalidRoleException exception, HttpServletRequest request) {
        LocalDateTime timestamp = LocalDateTime.now();
        Integer statusCode = HttpStatus.BAD_REQUEST.value();
        String error = exception.getMessage();
        String path = request.getRequestURI();
        return new ErrorResponseDTO(timestamp, statusCode, error, path);
    }

    @ExceptionHandler(RefreshTokenException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public ErrorResponseDTO handleRefreshTokenException(
            RefreshTokenException exception, HttpServletRequest request
    ) {
        LocalDateTime timestamp = LocalDateTime.now();
        Integer statusCode = HttpStatus.UNAUTHORIZED.value();
        String message = exception.getMessage();
        String path = request.getRequestURI();
        return new ErrorResponseDTO(timestamp, statusCode, message, path);
    }

    @ExceptionHandler(LockedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorResponseDTO handleRefreshTokenException(
            LockedException exception, HttpServletRequest request
    ) {
        LocalDateTime timestamp = LocalDateTime.now();
        Integer statusCode = HttpStatus.FORBIDDEN.value();
        String message = exception.getMessage();
        String path = request.getRequestURI();
        return new ErrorResponseDTO(timestamp, statusCode, message, path);
    }

    @ExceptionHandler(InvalidTokenException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public ErrorResponseDTO handleInvalidTokenException(
            InvalidTokenException exception, HttpServletRequest request
    ) {
        LocalDateTime timestamp = LocalDateTime.now();
        Integer statusCode = HttpStatus.UNAUTHORIZED.value();
        String message = exception.getMessage();
        String path = request.getRequestURI();
        return new ErrorResponseDTO(timestamp, statusCode, message, path);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ResponseBody
    public ErrorResponseDTO handleEntityNotFoundException(
            EntityNotFoundException exception, HttpServletRequest request
    ) {
        LocalDateTime timestamp = LocalDateTime.now();
        Integer statusCode = HttpStatus.NOT_FOUND.value();
        String message = exception.getMessage();
        String path = request.getRequestURI();
        return new ErrorResponseDTO(timestamp, statusCode, message, path);
    }

    @ExceptionHandler(ForbiddenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    @ResponseBody
    public ErrorResponseDTO handleForbiddenException(
            ForbiddenException exception, HttpServletRequest request
    ) {
        LocalDateTime timestamp = LocalDateTime.now();
        Integer statusCode = HttpStatus.FORBIDDEN.value();
        String message = exception.getMessage();
        String path = request.getRequestURI();
        return new ErrorResponseDTO(timestamp, statusCode, message, path);
    }
}
