package com.example.course_registration_system.service;

import com.example.course_registration_system.dto.CourseRequestDTO;
import com.example.course_registration_system.dto.CourseResponseDTO;
import com.example.course_registration_system.entity.Course;
import com.example.course_registration_system.exception.CourseNotFoundException;
import com.example.course_registration_system.repository.CourseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    private static final Logger log =
            LoggerFactory.getLogger(CourseService.class);

    public Course addCourse(CourseRequestDTO request) {

        Course course = new Course();

        course.setCourseName(request.getCourseName());
        course.setDescription(request.getDescription());
        course.setDepartment(request.getDepartment());
        course.setCredits(request.getCredits());
        course.setCapacity(request.getCapacity());

        log.info("Adding new course: {}", course.getCourseName());

        return courseRepository.save(course);
    }

    public List<CourseResponseDTO> getAllCourses() {

        log.info("Fetching all courses");

        return courseRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public Page<CourseResponseDTO> getCourses(Pageable pageable) {

        return courseRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    public CourseResponseDTO getCourseById(int id) {

        log.info("Fetching course with id: {}", id);

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new CourseNotFoundException(
                                "Course with id " + id + " not found"
                        )
                );

        return convertToDTO(course);
    }

    public Course updateCourse(int id, CourseRequestDTO request) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new CourseNotFoundException(
                                "Course with id " + id + " not found"
                        )
                );

        course.setCourseName(request.getCourseName());
        course.setDescription(request.getDescription());
        course.setDepartment(request.getDepartment());
        course.setCredits(request.getCredits());
        course.setCapacity(request.getCapacity());

        log.info("Updating course with id: {}", id);

        return courseRepository.save(course);
    }

    public void deleteCourse(int id) {

        log.info("Deleting course with id: {}", id);

        courseRepository.deleteById(id);
    }

    private CourseResponseDTO convertToDTO(Course course) {

        return new CourseResponseDTO(
                course.getId(),
                course.getCourseName(),
                course.getDescription(),
                course.getDepartment(),
                course.getCredits(),
                course.getCapacity()
        );
    }


}