package com.example.course_registration_system.dto;

import com.example.course_registration_system.entity.RegistrationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RegistrationResponseDTO {

    private int id;
    private int userId;
    private int courseId;
    private String courseName;
    private LocalDateTime registeredAt;
    private RegistrationStatus status;
}