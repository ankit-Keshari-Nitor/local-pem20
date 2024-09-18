package com.precisely.pem.exceptionhandler;

public class InvalidFileException extends Exception{
    public InvalidFileException(String message) {
        super(message);
    }
}
