package com.placement.campusplacement.repository;

import com.placement.campusplacement.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OfferRepository extends JpaRepository<Offer, Long> {

    Optional<Offer> findByApplication_ApplicationId(Long applicationId);

    boolean existsByApplication_ApplicationId(Long applicationId);

    @Query("SELECT o FROM Offer o " +
           "JOIN FETCH o.application a " +
           "JOIN FETCH a.student s " +
           "JOIN FETCH s.user " +
           "JOIN FETCH s.department " +
           "JOIN FETCH a.drive d " +
           "JOIN FETCH d.company " +
           "JOIN FETCH d.jobRole " +
           "WHERE s.studentId = :studentId " +
           "ORDER BY o.offerDate DESC")
    List<Offer> findByStudentIdWithDetails(@Param("studentId") Long studentId);

    @Query("SELECT o FROM Offer o " +
           "JOIN FETCH o.application a " +
           "JOIN FETCH a.student s " +
           "JOIN FETCH s.user " +
           "JOIN FETCH s.department " +
           "JOIN FETCH a.drive d " +
           "JOIN FETCH d.company " +
           "JOIN FETCH d.jobRole " +
           "WHERE o.offerId = :id")
    Optional<Offer> findByIdWithDetails(@Param("id") Long id);

    @Query("SELECT o FROM Offer o " +
           "JOIN FETCH o.application a " +
           "JOIN FETCH a.student s " +
           "JOIN FETCH s.user " +
           "JOIN FETCH s.department " +
           "JOIN FETCH a.drive d " +
           "JOIN FETCH d.company " +
           "JOIN FETCH d.jobRole " +
           "ORDER BY o.createdAt DESC")
    List<Offer> findAllWithDetails();
}
