package com.example.course_registration_system.exception;

public class CourseFullException extends RuntimeException{
    public CourseFullException(String message){
        super(message);
    }
}
