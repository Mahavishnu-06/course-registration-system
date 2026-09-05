package com.example.course_registration_system.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Entity
public class Registration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private int id;
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    private LocalDateTime registeredAt;
    @Enumerated(EnumType.STRING)
    private RegistrationStatus status;
}
