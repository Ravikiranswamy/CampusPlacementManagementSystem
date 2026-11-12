package com.placement.campusplacement.repository;

import com.placement.campusplacement.entity.RoundResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RoundResultRepository extends JpaRepository<RoundResult, Long> {

    @Query("SELECT rr FROM RoundResult rr " +
           "JOIN FETCH rr.application a " +
           "JOIN FETCH a.student s " +
           "JOIN FETCH s.user " +
           "JOIN FETCH a.drive " +
           "JOIN FETCH rr.round " +
           "WHERE rr.application.applicationId = :applicationId " +
           "ORDER BY rr.round.roundNumber ASC")
    List<RoundResult> findByApplicationIdWithDetails(@Param("applicationId") Long applicationId);

    @Query("SELECT rr FROM RoundResult rr " +
           "JOIN FETCH rr.application a " +
           "JOIN FETCH a.student s " +
           "JOIN FETCH s.user " +
           "JOIN FETCH a.drive " +
           "JOIN FETCH rr.round " +
           "WHERE rr.round.roundId = :roundId " +
           "ORDER BY rr.score DESC NULLS LAST")
    List<RoundResult> findByRoundIdWithDetails(@Param("roundId") Long roundId);

    Optional<RoundResult> findByApplication_ApplicationIdAndRound_RoundId(Long applicationId, Long roundId);

    boolean existsByApplication_ApplicationIdAndRound_RoundId(Long applicationId, Long roundId);
}

