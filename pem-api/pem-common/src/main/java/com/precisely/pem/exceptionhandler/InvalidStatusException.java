package com.precisely.pem.exceptionhandler;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
public class InvalidStatusException extends Exception{
    String fieldName;
    String errorCode;
    String message;
    public InvalidStatusException(String message) {
        super(message);
    }
    public InvalidStatusException(String errorCode, String message) {
        this.errorCode = errorCode;
        this.message = message;
    }
}
