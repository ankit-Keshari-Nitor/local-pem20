package com.precisely.pem.Validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Constraint(validatedBy = LowerCaseValidation.class)
@Target({ElementType.PARAMETER,ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface LowerCaseValidator {
    String message() default "";

    String name() default "";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
