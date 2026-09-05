package com.example.course_registration_system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendVerificationEmail(String to, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Course Registration - Email Verification");

        message.setText(
                "Hello,\n\n" +
                        "Your email verification OTP is: " + otp + "\n\n" +
                        "This OTP will expire in 10 minutes.\n\n" +
                        "Please do not share this OTP with anyone."
        );

        mailSender.send(message);
    }

    @Async
    public void sendRegistrationConfirmation(
            String to,
            String courseName) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);

        message.setSubject("Course Registration Successful");

        message.setText(
                "Hello,\n\n" +
                        "Your course registration was successful.\n\n" +
                        "Course: " + courseName + "\n\n" +
                        "You have been successfully registered for this course.\n\n" +
                        "Thank you."
        );

        mailSender.send(message);
    }

    @Async
    public void sendCourseDropEmail(
            String to,
            String courseName) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);

        message.setSubject("Course Dropped Successfully");

        message.setText(
                "Hello,\n\n" +
                        "Your course has been dropped successfully.\n\n" +
                        "Course: " + courseName + "\n\n" +
                        "You are no longer registered for this course.\n\n" +
                        "Thank you."
        );

        mailSender.send(message);
    }

    @Async
    public void sendAdminRegistrationNotification(
            String adminEmail,
            String studentName,
            String studentEmail,
            String courseName) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(adminEmail);

        message.setSubject("New Course Registration");

        message.setText(
                "Hello Admin,\n\n" +
                        "A new student has registered for a course.\n\n" +
                        "Student Name: " + studentName + "\n" +
                        "Student Email: " + studentEmail + "\n" +
                        "Course: " + courseName + "\n\n" +
                        "Please check the registration system for more details."
        );

        mailSender.send(message);
    }
}