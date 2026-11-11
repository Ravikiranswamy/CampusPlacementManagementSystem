
package com.placement.campusplacement.controller;

import com.placement.campusplacement.dto.ApiResponse;
import com.placement.campusplacement.dto.StudentResponse;
import com.placement.campusplacement.entity.Student;
import com.placement.campusplacement.repository.StudentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for student-related endpoints.
 * NOTE: Business logic will move to StudentService in Milestone 3.
 * This controller currently wires directly to the repository only for
 * the GET-all endpoint that was already working and tested.
 */
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /**
     * GET /api/students
     * Returns a list of all students wrapped in a standard ApiResponse.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getAllStudents() {

        List<StudentResponse> students = studentRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(
                ApiResponse.success("Students retrieved successfully", students)
        );
    }

    // ── Private helper — converts Student entity to safe DTO ─────────────────
    private StudentResponse toResponse(Student student) {
        return new StudentResponse(
                student.getStudentId(),
                student.getUser().getFullName(),
                student.getUser().getEmail(),
                student.getUsn(),
                student.getDepartment().getDepartmentCode(),
                student.getDepartment().getDepartmentName(),
                student.getSection(),
                student.getCgpa(),
                student.getActiveBacklogs(),
                student.getGraduationYear(),
                student.getPhone(),
                student.getResumeUrl(),
                student.getCreatedAt()
        );
    }
}
