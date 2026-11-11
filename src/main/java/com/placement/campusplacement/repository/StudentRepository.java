
package com.placement.campusplacement.repository;

import com.placement.campusplacement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
}
