package com.precisely.pem.Validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Constraint(validatedBy = NumericValidation.class)
@Target({ElementType.PARAMETER,ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface NumericValidator {
    String message() default "Only numbers allowed.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
