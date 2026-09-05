package com.example.course_registration_system.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Data
@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String courseName;
    private String description;
    private String department;
    private int  credits;
    private int capacity;
    @OneToMany(mappedBy = "course")
    @JsonIgnore
    private List<Registration> registrations;
}
