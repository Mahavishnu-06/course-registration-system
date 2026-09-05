package com.example.course_registration_system.controller;

import com.example.course_registration_system.dto.CourseRequestDTO;
import com.example.course_registration_system.dto.CourseResponseDTO;
import com.example.course_registration_system.entity.Course;
import com.example.course_registration_system.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;


    @PostMapping
    public String addCourse(
            @Valid @RequestBody CourseRequestDTO request) {

        courseService.addCourse(request);

        return "Course added Successfully";
    }
    @GetMapping("/page")
    public Page<CourseResponseDTO> getCourses(Pageable pageable) {

        return courseService.getCourses(pageable);
    }

    @GetMapping
    public List<CourseResponseDTO> getAllCourses() {
       System.out.print("vishnu...");
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public CourseResponseDTO getCourseById(
            @PathVariable int id) {

        return courseService.getCourseById(id);
    }

    @PutMapping("/{id}")
    public void updateCourse(
            @PathVariable int id,
            @Valid @RequestBody CourseRequestDTO request) {

        courseService.updateCourse(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable int id) {

        courseService.deleteCourse(id);
    }
}