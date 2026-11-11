package com.placement.campusplacement.repository;

import com.placement.campusplacement.entity.StudentSkill;
import com.placement.campusplacement.entity.StudentSkillId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudentSkillRepository extends JpaRepository<StudentSkill, StudentSkillId> {

    @Query("SELECT ss FROM StudentSkill ss JOIN FETCH ss.skill WHERE ss.student.studentId = :studentId")
    List<StudentSkill> findByStudentIdWithSkill(@Param("studentId") Long studentId);

    boolean existsById(StudentSkillId id);

    void deleteById(StudentSkillId id);
}

