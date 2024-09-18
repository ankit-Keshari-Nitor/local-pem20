package com.precisely.pem.exceptionhandler;

public class OnlyOneDraftVersionException extends Exception{
    public OnlyOneDraftVersionException(String message) {
        super(message);
    }
}
