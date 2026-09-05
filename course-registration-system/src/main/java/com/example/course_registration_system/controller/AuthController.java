package com.example.course_registration_system.controller;

import com.example.course_registration_system.dto.LoginRequestDTO;
import com.example.course_registration_system.dto.LoginResponseDTO;
import com.example.course_registration_system.service.AuthService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponseDTO login(
            @Valid @RequestBody LoginRequestDTO loginRequest) {

        return authService.login(loginRequest);
    }
}