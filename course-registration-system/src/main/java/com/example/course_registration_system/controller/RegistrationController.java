package com.example.course_registration_system.controller;

import com.example.course_registration_system.dto.RegistrationResponseDTO;
import com.example.course_registration_system.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;


    // ==============================
    // STUDENT - MY COURSES
    // ==============================

    @GetMapping("/my-courses")
    public List<RegistrationResponseDTO> getMyCourses(
            Authentication authentication) {

        String email = authentication.getName();

        return registrationService.getMyCourses(email);
    }


    // ==============================
    // STUDENT - DROP COURSE
    // ==============================

    @DeleteMapping("/{id}")
    public RegistrationResponseDTO dropCourse(
            @PathVariable int id,
            Authentication authentication) {

        String email = authentication.getName();

        return registrationService.dropCourse(
                id,
                email
        );
    }


    // ==============================
    // STUDENT - REGISTER COURSE
    // ==============================

    @PostMapping("/{courseId}")
    public RegistrationResponseDTO registerCourse(
            @PathVariable int courseId,
            Authentication authentication) {

        String email = authentication.getName();

        return registrationService.registerCourse(
                email,
                courseId
        );
    }


    // ==============================
    // ADMIN - VIEW COURSE REGISTRATIONS
    // ==============================

    @GetMapping("/course/{id}")
    public List<RegistrationResponseDTO> getCourseRegistrations(
            @PathVariable int id) {

        return registrationService.getCourseRegistrations(id);
    }
}