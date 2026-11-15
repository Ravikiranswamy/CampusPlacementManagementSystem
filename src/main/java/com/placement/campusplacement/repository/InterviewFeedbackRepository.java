package com.placement.campusplacement.repository;

import com.placement.campusplacement.entity.InterviewFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewFeedbackRepository extends JpaRepository<InterviewFeedback, Long> {

    @Query("SELECT f FROM InterviewFeedback f " +
           "JOIN FETCH f.student s " +
           "JOIN FETCH s.user u " +
           "JOIN FETCH s.department d " +
           "LEFT JOIN FETCH f.company c " +
           "ORDER BY f.createdAt DESC")
    List<InterviewFeedback> findAllWithDetails();

    List<InterviewFeedback> findByCompanyNameContainingIgnoreCase(String companyName);

    List<InterviewFeedback> findByGraduationYear(Integer graduationYear);

    List<InterviewFeedback> findByStudentStudentId(Long studentId);
}

