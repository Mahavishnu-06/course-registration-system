package com.example.course_registration_system.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResendOtpDTO {
    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email")
    private String email;
}
