package com.example.course_registration_system.dto;

import java.time.LocalDateTime;

public class RecentRegistrationDTO {

    private int registrationId;
    private String studentName;
    private String studentEmail;
    private String courseName;
    private LocalDateTime registeredAt;

    public RecentRegistrationDTO(
            int registrationId,
            String studentName,
            String studentEmail,
            String courseName,
            LocalDateTime registeredAt) {

        this.registrationId = registrationId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.courseName = courseName;
        this.registeredAt = registeredAt;
    }

    public int getRegistrationId() {
        return registrationId;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public String getCourseName() {
        return courseName;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }
}