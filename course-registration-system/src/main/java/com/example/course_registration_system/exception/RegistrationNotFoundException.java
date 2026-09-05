package com.example.course_registration_system.exception;

import org.apache.el.util.ReflectionUtil;

public class RegistrationNotFoundException extends RuntimeException {
     public RegistrationNotFoundException(String message){
         super(message);
     }
}
