package com.example.course_registration_system.dto;

import com.example.course_registration_system.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponseDTO {

    private int id;
    private String name;
    private String email;
    private String department;
    private int year;
    private Role role;
    private boolean emailVerified;
}