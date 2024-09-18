package com.precisely.pem.exceptionhandler;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
public class BpmnConverterException extends Exception {
    String fieldName;
    String errorCode;
    String message;

    public BpmnConverterException(String errorCode, String message) {
        this.errorCode = errorCode;
        this.message = message;
    }

    public BpmnConverterException(String message) {
        super(message);
    }
}
