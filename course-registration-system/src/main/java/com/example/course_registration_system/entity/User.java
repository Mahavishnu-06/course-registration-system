package com.example.course_registration_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
public class User {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private int id;
     private String name;
    @Column(nullable = false, unique = true)
     private String email;
     private String password;
     private String department;
     private int year;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
     private  Role role;
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Registration> registrations;


    private boolean emailVerified;
    @Column(name = "verification_otp")
    private String verificationOtp;

    @Column(name = "otp_expiry")
    private LocalDateTime otpExpiry;
}
