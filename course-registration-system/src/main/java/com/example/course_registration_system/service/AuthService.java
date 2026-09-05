package com.example.course_registration_system.service;

import com.example.course_registration_system.dto.LoginRequestDTO;
import com.example.course_registration_system.dto.LoginResponseDTO;
import com.example.course_registration_system.entity.User;
import com.example.course_registration_system.exception.EmailNotVerifiedException;
import com.example.course_registration_system.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;


    public LoginResponseDTO login(LoginRequestDTO loginRequest) {

        User user = userRepository
                .findByEmail(loginRequest.getEmail())
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with email: "
                                        + loginRequest.getEmail()
                        )
                );

        // User must verify email before login
        if (!user.isEmailVerified()) {
            throw new EmailNotVerifiedException(
                    "Please verify your email before login"
            );
        }

        // Check email + password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        // Generate JWT
        String token =
                jwtService.generateToken(user.getEmail());

        // Return token + role
        return new LoginResponseDTO(
                "Login successful",
                token,
                user.getRole().name()
        );
    }
}