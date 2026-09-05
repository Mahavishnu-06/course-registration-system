package com.example.course_registration_system.controller;

import com.example.course_registration_system.dto.*;
import com.example.course_registration_system.entity.User;
import com.example.course_registration_system.service.RegistrationService;
import com.example.course_registration_system.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

      @Autowired
      private UserService userService;

      @Autowired
      private RegistrationService registrationService;
      // =========================================================
      // REGISTER STUDENT
      // =========================================================

      @PostMapping("/register")
      public UserResponseDTO registerStudent(
              @Valid @RequestBody UserRequestDTO userRequest) {

            User user = new User();

            user.setName(userRequest.getName());
            user.setEmail(userRequest.getEmail());
            user.setPassword(userRequest.getPassword());
            user.setDepartment(userRequest.getDepartment());
            user.setYear(userRequest.getYear());

            return userService.registerStudent(user);
      }

      @GetMapping("/admin/dashboard/recent-registrations")
      public List<RegistrationResponseDTO> getRecentRegistrations() {

            return registrationService.getRecentRegistrations();
      }
      @GetMapping("/admin/dashboard/most-popular-course")
      public CourseRegistrationStatsDTO getMostPopularCourse() {

            return registrationService.getMostPopularCourse();
      }
      @GetMapping("/admin/dashboard/recent-students")
      public List<RecentRegistrationDTO> getRecentStudentRegistrations() {

            return registrationService.getRecentStudentRegistrations();
      }
      // =========================================================
      // VERIFY OTP
      // =========================================================

      @PostMapping("/verify-otp")
      public String verifyEmail(
              @Valid @RequestBody EmailVerificationDTO request) {

            return userService.verifyEmail(
                    request.getEmail(),
                    request.getOtp()
            );
      }


      // =========================================================
      // RESEND OTP
      // =========================================================

      @PostMapping("/resend-otp")
      public String resendOtp(
              @Valid @RequestBody ResendOtpDTO request) {

            return userService.resendOtp(
                    request.getEmail()
            );
      }

      @PutMapping("/profile")
      public UserResponseDTO updateMyProfile(
              @Valid @RequestBody UpdateProfileDTO request,
              Authentication authentication) {

            String email = authentication.getName();

            return userService.updateMyProfile(
                    email,
                    request
            );
      }
      @GetMapping("/admin/dashboard")
      public AdminDashboardDTO getDashboardSummary() {
            return userService.getDashboardSummary();
      }
      @GetMapping("/admin/dashboard/courses")
      public List<CourseRegistrationStatsDTO> getCourseRegistrationStats() {

            return registrationService.getCourseRegistrationStats();
      }
      @GetMapping("/students/{id}")
      public UserResponseDTO getStudentById(
              @PathVariable int id) {

            return userService.getStudentById(id);
      }
      @GetMapping("/students")
      public List<UserResponseDTO> getAllStudents() {

            return userService.getAllStudents();
      }
      // =========================================================
      // GET MY PROFILE
      // =========================================================

      @GetMapping("/profile")
      public UserResponseDTO getMyProfile(
              Authentication authentication) {

            String email = authentication.getName();

            return userService.getMyProfile(email);
      }
}