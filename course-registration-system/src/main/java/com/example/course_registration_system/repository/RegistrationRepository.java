package com.example.course_registration_system.repository;

import com.example.course_registration_system.entity.Registration;
import com.example.course_registration_system.entity.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface RegistrationRepository extends JpaRepository<Registration,Integer> {
    boolean existsByUserIdAndCourseIdAndStatus(int userId, int courseId, RegistrationStatus status);
    List<Registration> findByUserIdAndStatus(int userId, RegistrationStatus status);
    List<Registration> findByCourseIdAndStatus(int courseId, RegistrationStatus status);
    long countByStatus(RegistrationStatus status);
    List<Registration> findTop10ByStatusOrderByRegisteredAtDesc(
            RegistrationStatus status
    );
    long countByCourseIdAndStatus(int courseId, RegistrationStatus status);
}
