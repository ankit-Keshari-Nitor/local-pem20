package com.precisely.pem.exceptionhandler;

import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
public class ResourceNotFoundException extends Exception{
    String fieldName;
    String errorCode;
    String message;

    public ResourceNotFoundException(String errorCode, String message) {
        this.errorCode = errorCode;
        this.message = message;
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
