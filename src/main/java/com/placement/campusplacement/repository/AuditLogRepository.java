package com.placement.campusplacement.repository;

import com.placement.campusplacement.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("SELECT l FROM AuditLog l " +
           "JOIN FETCH l.performedBy " +
           "ORDER BY l.performedAt DESC")
    List<AuditLog> findAllWithDetails();
}
