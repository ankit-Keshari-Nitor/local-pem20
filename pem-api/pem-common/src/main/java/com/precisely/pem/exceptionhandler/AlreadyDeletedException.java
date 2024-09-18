package com.precisely.pem.exceptionhandler;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@Data
public class AlreadyDeletedException extends Exception {
    String fieldName;
    String errorCode;
    String message;

    public AlreadyDeletedException(String errorCode, String message) {
        this.errorCode = errorCode;
        this.message = message;
    }

    public AlreadyDeletedException(String message) {
        super(message);
    }
}
