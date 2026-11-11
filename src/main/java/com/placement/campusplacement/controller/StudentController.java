package com.placement.campusplacement.controller;

import com.placement.campusplacement.dto.ApiResponse;
import com.placement.campusplacement.dto.StudentResponse;
import com.placement.campusplacement.dto.StudentSkillResponse;
import com.placement.campusplacement.dto.request.StudentRegistrationRequest;
import com.placement.campusplacement.dto.request.StudentSkillRequest;
import com.placement.campusplacement.dto.request.StudentUpdateRequest;
import com.placement.campusplacement.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for student operations:
 * Registration, profile retrieval, updates, and skill management.
 */
@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /**
     * GET /api/students
     * Retrieve all registered students.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getAllStudents() {
        List<StudentResponse> students = studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", students));
    }

    /**
     * GET /api/students/{id}
     * Retrieve a specific student by studentId.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(@PathVariable Long id) {
        StudentResponse student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Student retrieved successfully", student));
    }

    /**
     * POST /api/students
     * Register a new student (creates User + Student in one transaction).
     */
    @PostMapping
    public ResponseEntity<ApiResponse<StudentResponse>> registerStudent(
            @Valid @RequestBody StudentRegistrationRequest request) {
        StudentResponse created = studentService.registerStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student registered successfully", created));
    }

    /**
     * PUT /api/students/{id}
     * Update an existing student's profile.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentUpdateRequest request) {
        StudentResponse updated = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updated));
    }

    /**
     * GET /api/students/{id}/skills
     * Retrieve all skills associated with a specific student.
     */
    @GetMapping("/{id}/skills")
    public ResponseEntity<ApiResponse<List<StudentSkillResponse>>> getStudentSkills(@PathVariable Long id) {
        List<StudentSkillResponse> skills = studentService.getStudentSkills(id);
        return ResponseEntity.ok(ApiResponse.success("Student skills retrieved successfully", skills));
    }

    /**
     * POST /api/students/{id}/skills
     * Assign a skill to a student with proficiency level and optional certification URL.
     */
    @PostMapping("/{id}/skills")
    public ResponseEntity<ApiResponse<StudentSkillResponse>> addStudentSkill(
            @PathVariable Long id,
            @Valid @RequestBody StudentSkillRequest request) {
        StudentSkillResponse added = studentService.addStudentSkill(id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Skill assigned to student successfully", added));
    }

    /**
     * DELETE /api/students/{id}/skills/{skillId}
     * Remove a skill association from a student.
     */
    @DeleteMapping("/{id}/skills/{skillId}")
    public ResponseEntity<ApiResponse<Void>> removeStudentSkill(
            @PathVariable Long id,
            @PathVariable Long skillId) {
        studentService.removeStudentSkill(id, skillId);
        return ResponseEntity.ok(ApiResponse.success("Skill removed from student successfully"));
    }
}
