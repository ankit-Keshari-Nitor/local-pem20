package com.precisely.pem.exceptionhandler;

public class DuplicateEntryException extends Exception{
    public DuplicateEntryException(String message) {
        super(message);
    }
}
