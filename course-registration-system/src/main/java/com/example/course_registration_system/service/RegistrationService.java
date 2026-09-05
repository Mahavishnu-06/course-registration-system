package com.example.course_registration_system.service;
import com.example.course_registration_system.dto.CourseRegistrationStatsDTO;
import com.example.course_registration_system.dto.RecentRegistrationDTO;
import com.example.course_registration_system.dto.RegistrationResponseDTO;
import com.example.course_registration_system.entity.Course;
import com.example.course_registration_system.entity.Registration;
import com.example.course_registration_system.entity.RegistrationStatus;
import com.example.course_registration_system.entity.User;
import com.example.course_registration_system.exception.*;
import com.example.course_registration_system.repository.CourseRepository;
import com.example.course_registration_system.repository.RegistrationRepository;
import com.example.course_registration_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Value("${app.admin.email}")
    private String adminEmail;


    // ==============================
    // REGISTER COURSE
    // ==============================

    public RegistrationResponseDTO registerCourse(
            String email,
            int courseId) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User with email " + email + " not found"
                        )
                );

        Course course = courseRepository
                .findById(courseId)
                .orElseThrow(() ->
                        new CourseNotFoundException(
                                "Course with id " + courseId + " not found"
                        )
                );

        // Prevent duplicate active registration
        if (registrationRepository
                .existsByUserIdAndCourseIdAndStatus(
                        user.getId(),
                        courseId,
                        RegistrationStatus.ACTIVE)) {

            throw new DuplicateRegistrationException(
                    "User is already registered for this course"
            );
        }

        // Count active students
        long registeredStudents =
                registrationRepository
                        .countByCourseIdAndStatus(
                                courseId,
                                RegistrationStatus.ACTIVE
                        );

        // Check capacity
        long availableSeats =
                course.getCapacity() - registeredStudents;

        if (availableSeats <= 0) {

            throw new CourseFullException(
                    "Course is full. No seats are available"
            );
        }

        Registration registration = new Registration();

        registration.setUser(user);
        registration.setCourse(course);
        registration.setRegisteredAt(
                LocalDateTime.now()
        );
        registration.setStatus(
                RegistrationStatus.ACTIVE
        );

        Registration savedRegistration =
                registrationRepository.save(registration);

        // Student email
        emailService.sendRegistrationConfirmation(
                user.getEmail(),
                course.getCourseName()
        );

        // Admin email
        emailService.sendAdminRegistrationNotification(
                adminEmail,
                user.getName(),
                user.getEmail(),
                course.getCourseName()
        );

        return convertToDTO(savedRegistration);
    }

    public List<RegistrationResponseDTO> getRecentRegistrations() {

        return registrationRepository
                .findTop10ByStatusOrderByRegisteredAtDesc(
                        RegistrationStatus.ACTIVE
                )
                .stream()
                .map(this::convertToDTO)
                .toList();
    }
    // ==============================
    // DROP COURSE
    // ==============================

    public RegistrationResponseDTO dropCourse(
            int registrationId,
            String email) {

        Registration registration =
                registrationRepository
                        .findById(registrationId)
                        .orElseThrow(() ->
                                new RegistrationNotFoundException(
                                        "Registration with id "
                                                + registrationId
                                                + " not found"
                                )
                        );

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User with email "
                                        + email
                                        + " not found"
                        )
                );

        // IMPORTANT:
        // Student can only drop their own registration
        if (registration.getUser().getId()
                != user.getId()) {

            throw new UnauthorizedException(
                    "You are not allowed to drop this registration"
            );
        }

        if (registration.getStatus()
                == RegistrationStatus.DROPPED) {

            throw new RegistrationAlreadyDroppedException(
                    "Registration with id "
                            + registrationId
                            + " is already dropped"
            );
        }

        registration.setStatus(
                RegistrationStatus.DROPPED
        );

        Registration savedRegistration =
                registrationRepository.save(registration);

        emailService.sendCourseDropEmail(
                registration.getUser().getEmail(),
                registration.getCourse().getCourseName()
        );

        return convertToDTO(savedRegistration);
    }


    // ==============================
    // GET MY COURSES
    // ==============================

    public List<RegistrationResponseDTO> getMyCourses(
            String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User with email "
                                        + email
                                        + " not found"
                        )
                );

        return registrationRepository
                .findByUserIdAndStatus(
                        user.getId(),
                        RegistrationStatus.ACTIVE
                )
                .stream()
                .map(this::convertToDTO)
                .toList();
    }


    // ==============================
    // ADMIN - COURSE REGISTRATIONS
    // ==============================

    public List<RegistrationResponseDTO> getCourseRegistrations(
            int courseId) {

        courseRepository
                .findById(courseId)
                .orElseThrow(() ->
                        new CourseNotFoundException(
                                "Course with id "
                                        + courseId
                                        + " not found"
                        )
                );

        return registrationRepository
                .findByCourseIdAndStatus(
                        courseId,
                        RegistrationStatus.ACTIVE
                )
                .stream()
                .map(this::convertToDTO)
                .toList();
    }


    // ==============================
    // ENTITY → DTO
    // ==============================

    private RegistrationResponseDTO convertToDTO(
            Registration registration) {

        return new RegistrationResponseDTO(
                registration.getId(),
                registration.getUser().getId(),
                registration.getCourse().getId(),
                registration.getCourse().getCourseName(),
                registration.getRegisteredAt(),
                registration.getStatus()
        );
    }
    public List<CourseRegistrationStatsDTO> getCourseRegistrationStats() {

        List<Course> courses = courseRepository.findAll();

        return courses.stream()
                .map(course -> {

                    long registeredStudents =
                            registrationRepository
                                    .countByCourseIdAndStatus(
                                            course.getId(),
                                            RegistrationStatus.ACTIVE
                                    );

                    long availableSeats =
                            course.getCapacity() - registeredStudents;

                    String status;

                    if (availableSeats <= 0) {
                        status = "FULL";
                        availableSeats = 0;
                    } else {
                        status = "AVAILABLE";
                    }

                    return new CourseRegistrationStatsDTO(
                            course.getId(),
                            course.getCourseName(),
                            registeredStudents,
                            course.getCapacity(),
                            availableSeats,
                            status
                    );
                })
                .toList();
    }
    public CourseRegistrationStatsDTO getMostPopularCourse() {

        List<CourseRegistrationStatsDTO> courses =
                getCourseRegistrationStats();

        return courses.stream()
                .max((c1, c2) ->
                        Long.compare(
                                c1.getRegisteredStudents(),
                                c2.getRegisteredStudents()
                        )
                )
                .orElse(null);
    }
    public List<RecentRegistrationDTO> getRecentStudentRegistrations() {

        return registrationRepository
                .findTop10ByStatusOrderByRegisteredAtDesc(
                        RegistrationStatus.ACTIVE
                )
                .stream()
                .map(registration ->
                        new RecentRegistrationDTO(
                                registration.getId(),
                                registration.getUser().getName(),
                                registration.getUser().getEmail(),
                                registration.getCourse().getCourseName(),
                                registration.getRegisteredAt()
                        )
                )
                .toList();
    }
}