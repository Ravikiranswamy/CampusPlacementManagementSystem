package com.placement.campusplacement.repository;

import com.placement.campusplacement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByUsn(String usn);

    Optional<Student> findByUsn(String usn);

    Optional<Student> findByUser_UserId(Long userId);

    Optional<Student> findByUser_Email(String email);

    @Query("SELECT s FROM Student s JOIN FETCH s.user JOIN FETCH s.department WHERE s.studentId = :id")
    Optional<Student> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT s FROM Student s JOIN FETCH s.user JOIN FETCH s.department")
    List<Student> findAllWithDetails();
}
