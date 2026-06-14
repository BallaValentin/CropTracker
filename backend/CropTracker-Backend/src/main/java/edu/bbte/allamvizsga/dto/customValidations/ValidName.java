package edu.bbte.allamvizsga.dto.customValidations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.ReportAsSingleViolation;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = {})
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@ReportAsSingleViolation
@NotBlank
@Pattern(regexp = "^\\p{Lu}(?![\\s_-]*$)[\\p{L}\\d\\s_-]{2,33}[\\p{L}\\d]$")
public @interface ValidName {
    String message() default "Invalid name format";

    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
