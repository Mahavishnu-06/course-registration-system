package com.example.course_registration_system.dto;

public class CourseRegistrationStatsDTO {

    private int courseId;
    private String courseName;
    private long registeredStudents;
    private int capacity;
    private long availableSeats;
    private String status;

    public CourseRegistrationStatsDTO(
            int courseId,
            String courseName,
            long registeredStudents,
            int capacity,
            long availableSeats,
            String status) {

        this.courseId = courseId;
        this.courseName = courseName;
        this.registeredStudents = registeredStudents;
        this.capacity = capacity;
        this.availableSeats = availableSeats;
        this.status = status;
    }

    public int getCourseId() {
        return courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public long getRegisteredStudents() {
        return registeredStudents;
    }

    public int getCapacity() {
        return capacity;
    }

    public long getAvailableSeats() {
        return availableSeats;
    }

    public String getStatus() {
        return status;
    }
}