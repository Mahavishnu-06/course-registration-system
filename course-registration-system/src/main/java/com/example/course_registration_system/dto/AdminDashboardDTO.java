package com.example.course_registration_system.dto;

public class AdminDashboardDTO {

    private long totalStudents;
    private long totalCourses;
    private long totalRegistrations;
    private long verifiedStudents;
    private long unverifiedStudents;
    public AdminDashboardDTO(
            long totalStudents,
            long totalCourses,
            long totalRegistrations,
            long verifiedStudents,
            long unverifiedStudents) {

        this.totalStudents = totalStudents;
        this.totalCourses = totalCourses;
        this.totalRegistrations = totalRegistrations;
        this.verifiedStudents = verifiedStudents;
        this.unverifiedStudents = unverifiedStudents;
    }
    public long getVerifiedStudents() {
        return verifiedStudents;
    }

    public long getUnverifiedStudents() {
        return unverifiedStudents;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public long getTotalCourses() {
        return totalCourses;
    }

    public long getTotalRegistrations() {
        return totalRegistrations;
    }
}