package com.placement.campusplacement.service;

import com.placement.campusplacement.dto.StudentResponse;
import com.placement.campusplacement.dto.StudentSkillResponse;
import com.placement.campusplacement.dto.request.StudentRegistrationRequest;
import com.placement.campusplacement.dto.request.StudentSkillRequest;
import com.placement.campusplacement.dto.request.StudentUpdateRequest;

import java.util.List;

public interface StudentService {

    List<StudentResponse> getAllStudents();

    StudentResponse getStudentById(Long id);

    StudentResponse registerStudent(StudentRegistrationRequest request);

    StudentResponse updateStudent(Long id, StudentUpdateRequest request);

    List<StudentSkillResponse> getStudentSkills(Long studentId);

    StudentSkillResponse addStudentSkill(Long studentId, StudentSkillRequest request);

    void removeStudentSkill(Long studentId, Long skillId);
}
