package com.example.course_registration_system.service;

import com.example.course_registration_system.dto.AdminDashboardDTO;
import com.example.course_registration_system.dto.UpdateProfileDTO;
import com.example.course_registration_system.dto.UserResponseDTO;
import com.example.course_registration_system.entity.RegistrationStatus;
import com.example.course_registration_system.entity.Role;
import com.example.course_registration_system.entity.User;
import com.example.course_registration_system.exception.DuplicateEmailException;
import com.example.course_registration_system.exception.EmailAlreadyVerifiedException;
import com.example.course_registration_system.exception.InvalidOtpException;
import com.example.course_registration_system.exception.UserNotFoundException;
import com.example.course_registration_system.repository.CourseRepository;
import com.example.course_registration_system.repository.RegistrationRepository;
import com.example.course_registration_system.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private RegistrationRepository registrationRepository;
    public UserResponseDTO registerStudent(User user){
         if (userRepository.findByEmail(user.getEmail()).isPresent()) {
             throw new DuplicateEmailException(
                     "Email already registered: " + user.getEmail()
             );
         }
        SecureRandom random = new SecureRandom();
        String otp = String.format(
                "%06d",
                random.nextInt(1000000)
        );
             user.setRole(Role.STUDENT);
         user.setEmailVerified(false);
         user.setVerificationOtp(otp);
         user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
         user.setPassword(
                 passwordEncoder.encode(user.getPassword())
         );
         User savedUser = userRepository.save(user);
         emailService.sendVerificationEmail(
                 savedUser.getEmail(),
                 otp
         );

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getDepartment(),
                savedUser.getYear(),
                savedUser.getRole(),
                savedUser.isEmailVerified()
        );
     }
    public List<UserResponseDTO> getAllStudents() {

        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == Role.STUDENT)
                .map(user -> new UserResponseDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getDepartment(),
                        user.getYear(),
                        user.getRole(),
                        user.isEmailVerified()
                ))
                .toList();
    }
    public UserResponseDTO getStudentById(int id) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User with id " + id + " not found"
                        )
                );

        if (user.getRole() != Role.STUDENT) {
            throw new UserNotFoundException(
                    "Student with id " + id + " not found"
            );
        }

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getDepartment(),
                user.getYear(),
                user.getRole(),
                user.isEmailVerified()
        );
    }
    public AdminDashboardDTO getDashboardSummary() {

        long totalStudents = userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == Role.STUDENT)
                .count();

        long verifiedStudents = userRepository.findAll()
                .stream()
                .filter(user ->
                        user.getRole() == Role.STUDENT
                                && user.isEmailVerified())
                .count();

        long unverifiedStudents = totalStudents - verifiedStudents;

        long totalCourses = courseRepository.count();

        long totalRegistrations =
                registrationRepository.countByStatus(
                        RegistrationStatus.ACTIVE
                );

        return new AdminDashboardDTO(
                totalStudents,
                totalCourses,
                totalRegistrations,
                verifiedStudents,
                unverifiedStudents
        );
    }
    public UserResponseDTO getMyProfile(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User with email " + email + " not found"
                        )
                );

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getDepartment(),
                user.getYear(),
                user.getRole(),
                user.isEmailVerified()
        );
    }
    public UserResponseDTO updateMyProfile(
            String email,
            UpdateProfileDTO request) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User with email " + email + " not found"
                        )
                );

        user.setName(request.getName());
        user.setDepartment(request.getDepartment());
        user.setYear(request.getYear());

        User updatedUser = userRepository.save(user);

        return new UserResponseDTO(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getEmail(),
                updatedUser.getDepartment(),
                updatedUser.getYear(),
                updatedUser.getRole(),
                updatedUser.isEmailVerified()
        );
    }
    public String verifyEmail(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found"
                        )
                );

        if (user.isEmailVerified()) {
            throw new EmailAlreadyVerifiedException(
                    "Email is already verified"
            );
        }

        if (!user.getVerificationOtp().equals(otp)) {
            throw new InvalidOtpException("Invalid OTP");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
                throw new InvalidOtpException("OTP has expired");
            }
        }

        user.setEmailVerified(true);
        user.setVerificationOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);

        return "Email verified successfully";
    }
    public String resendOtp(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (user.isEmailVerified()) {
            return "Email is already verified";
        }

        SecureRandom random = new SecureRandom();

        String otp = String.format(
                "%06d",
                random.nextInt(1000000)
        );

        user.setVerificationOtp(otp);

        user.setOtpExpiry(
                LocalDateTime.now().plusMinutes(10)
        );

        userRepository.save(user);

        emailService.sendVerificationEmail(
                user.getEmail(),
                otp
        );

        return "New OTP sent successfully";
    }

}
