package com.precisely.pem.exceptionhandler;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ParamMissingException extends Exception {
    String fieldName;
    String errorCode;
    String message;

    public ParamMissingException(String fieldName, String errorCode, String message) {
        this.fieldName = fieldName;
        this.errorCode = errorCode;
        this.message = message;
    }

    public ParamMissingException(String message) {
        super(message);
    }
}
