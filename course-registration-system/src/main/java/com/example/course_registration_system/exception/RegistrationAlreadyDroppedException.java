package com.example.course_registration_system.exception;

public class RegistrationAlreadyDroppedException extends RuntimeException{
    public RegistrationAlreadyDroppedException(String message) {
        super(message);
    }
}
