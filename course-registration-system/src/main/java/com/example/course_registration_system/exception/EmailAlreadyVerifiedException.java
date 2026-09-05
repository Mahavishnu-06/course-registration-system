package com.example.course_registration_system.exception;

public class EmailAlreadyVerifiedException extends RuntimeException{
    public EmailAlreadyVerifiedException(String message) {
        super(message);
    }
}
