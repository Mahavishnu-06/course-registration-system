package com.example.course_registration_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CourseResponseDTO {

    private int id;
    private String courseName;
    private String description;
    private String department;
    private int credits;
    private int capacity;
}