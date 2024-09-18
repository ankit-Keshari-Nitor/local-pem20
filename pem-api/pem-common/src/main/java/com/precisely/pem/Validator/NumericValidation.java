package com.precisely.pem.Validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class NumericValidation implements ConstraintValidator<NumericValidator, Integer> {
    @Override
    public boolean isValid(Integer integer, ConstraintValidatorContext constraintValidatorContext) {
        Pattern pattern = Pattern.compile("[0-9]");
        Matcher matcher = pattern.matcher(integer.toString());
        return matcher.find();
    }
}
