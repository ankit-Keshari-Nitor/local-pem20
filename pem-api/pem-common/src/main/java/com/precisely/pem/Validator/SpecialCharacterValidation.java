package com.precisely.pem.Validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SpecialCharacterValidation implements ConstraintValidator<SpecialCharValidator, String> {

    String name = "";

    @Override
    public void initialize(SpecialCharValidator requiredIfChecked) {
        this.name = requiredIfChecked.fieldName();
    }

    @Override
    public boolean isValid(String str, ConstraintValidatorContext constraintValidatorContext) {
        if(name.equalsIgnoreCase("description") && str.isEmpty()){
            return true;
        }
        Pattern pattern = Pattern.compile("[A-Za-z0-9&@!#$%()/+=_.,:;-]+");
        Matcher matcher = pattern.matcher(str);
        return matcher.find();
    }
}
