package com.precisely.pem.Validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.apache.commons.lang3.StringUtils;

public class LowerCaseValidation  implements ConstraintValidator<LowerCaseValidator, String> {

    String name = "";

    public void initialize(SpecialCharValidator requiredIfChecked) {
        this.name = requiredIfChecked.fieldName();
    }

    @Override
    public boolean isValid(String str, ConstraintValidatorContext constraintValidatorContext) {
        boolean isAllUpperCase = StringUtils.isAllUpperCase(str);
        if(!isAllUpperCase){
            constraintValidatorContext.disableDefaultConstraintViolation();
            constraintValidatorContext
                    .buildConstraintViolationWithTemplate("{};CaseSensitiveIssue;Invalid format for given string. Please check your input.")
                    .addConstraintViolation();
            return false;
        }
        return true;
    }
}
