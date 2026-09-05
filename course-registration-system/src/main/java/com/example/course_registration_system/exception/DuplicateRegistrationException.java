package com.example.course_registration_system.exception;

public class DuplicateRegistrationException extends RuntimeException{
    public DuplicateRegistrationException(String message){
        super(message);
    }
}
