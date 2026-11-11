package com.placement.campusplacement.service.impl;

import com.placement.campusplacement.dto.StudentResponse;
import com.placement.campusplacement.dto.StudentSkillResponse;
import com.placement.campusplacement.dto.request.StudentRegistrationRequest;
import com.placement.campusplacement.dto.request.StudentSkillRequest;
import com.placement.campusplacement.dto.request.StudentUpdateRequest;
import com.placement.campusplacement.entity.*;
import com.placement.campusplacement.exception.DuplicateResourceException;
import com.placement.campusplacement.exception.ResourceNotFoundException;
import com.placement.campusplacement.repository.*;
import com.placement.campusplacement.service.StudentService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentServiceImpl(StudentRepository studentRepository,
                              UserRepository userRepository,
                              DepartmentRepository departmentRepository,
                              SkillRepository skillRepository,
                              StudentSkillRepository studentSkillRepository,
                              PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.skillRepository = skillRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAllWithDetails()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        return mapToResponse(student);
    }

    @Override
    @Transactional
    public StudentResponse registerStudent(StudentRegistrationRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("An account with email '" + email + "' already exists.");
        }

        String usn = request.getUsn().trim().toUpperCase();
        if (studentRepository.existsByUsn(usn)) {
            throw new DuplicateResourceException("A student with USN '" + usn + "' already exists.");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("STUDENT");
        user.setIsActive(true);
        User savedUser = userRepository.save(user);

        Student student = new Student();
        student.setUser(savedUser);
        student.setDepartment(department);
        student.setUsn(usn);
        student.setSection(request.getSection() != null ? request.getSection().trim().toUpperCase() : null);
        student.setCgpa(request.getCgpa());
        student.setActiveBacklogs(request.getActiveBacklogs());
        student.setGraduationYear(request.getGraduationYear());
        student.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        student.setResumeUrl(request.getResumeUrl());
        Student savedStudent = studentRepository.save(student);

        return mapToResponse(savedStudent);
    }

    @Override
    @Transactional
    public StudentResponse updateStudent(Long id, StudentUpdateRequest request) {
        Student student = studentRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            student.getUser().setFullName(request.getFullName().trim());
            userRepository.save(student.getUser());
        }

        if (request.getSection() != null) {
            student.setSection(request.getSection().trim().toUpperCase());
        }
        if (request.getCgpa() != null) {
            student.setCgpa(request.getCgpa());
        }
        if (request.getActiveBacklogs() != null) {
            student.setActiveBacklogs(request.getActiveBacklogs());
        }
        if (request.getGraduationYear() != null) {
            student.setGraduationYear(request.getGraduationYear());
        }
        if (request.getPhone() != null) {
            student.setPhone(request.getPhone().trim());
        }
        if (request.getResumeUrl() != null) {
            student.setResumeUrl(request.getResumeUrl().trim());
        }

        Student updated = studentRepository.save(student);
        return mapToResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentSkillResponse> getStudentSkills(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student", "id", studentId);
        }

        return studentSkillRepository.findByStudentIdWithSkill(studentId)
                .stream()
                .map(ss -> new StudentSkillResponse(
                        ss.getSkill().getSkillId(),
                        ss.getSkill().getSkillName(),
                        ss.getSkill().getCategory(),
                        ss.getProficiencyLevel(),
                        ss.getCertificationUrl(),
                        ss.getAddedAt()
                ))
                .toList();
    }

    @Override
    @Transactional
    public StudentSkillResponse addStudentSkill(Long studentId, StudentSkillRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        Skill skill = skillRepository.findById(request.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", request.getSkillId()));

        StudentSkillId id = new StudentSkillId(studentId, request.getSkillId());
        if (studentSkillRepository.existsById(id)) {
            throw new DuplicateResourceException("Skill '" + skill.getSkillName() + "' is already assigned to this student.");
        }

        String proficiency = request.getProficiencyLevel() != null ?
                request.getProficiencyLevel().toUpperCase() : "INTERMEDIATE";

        StudentSkill studentSkill = new StudentSkill(student, skill, proficiency, request.getCertificationUrl());
        StudentSkill saved = studentSkillRepository.save(studentSkill);

        return new StudentSkillResponse(
                skill.getSkillId(),
                skill.getSkillName(),
                skill.getCategory(),
                saved.getProficiencyLevel(),
                saved.getCertificationUrl(),
                saved.getAddedAt()
        );
    }

    @Override
    @Transactional
    public void removeStudentSkill(Long studentId, Long skillId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student", "id", studentId);
        }

        StudentSkillId id = new StudentSkillId(studentId, skillId);
        if (!studentSkillRepository.existsById(id)) {
            throw new ResourceNotFoundException("StudentSkill", "skillId", skillId);
        }

        studentSkillRepository.deleteById(id);
    }

    private StudentResponse mapToResponse(Student student) {
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

