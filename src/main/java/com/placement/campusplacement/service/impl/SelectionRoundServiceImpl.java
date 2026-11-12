package com.placement.campusplacement.service.impl;

import com.placement.campusplacement.dto.RoundResultResponse;
import com.placement.campusplacement.dto.SelectionRoundResponse;
import com.placement.campusplacement.dto.request.RoundResultRequest;
import com.placement.campusplacement.dto.request.SelectionRoundRequest;
import com.placement.campusplacement.entity.Application;
import com.placement.campusplacement.entity.PlacementDrive;
import com.placement.campusplacement.entity.RoundResult;
import com.placement.campusplacement.entity.SelectionRound;
import com.placement.campusplacement.exception.BusinessRuleException;
import com.placement.campusplacement.exception.DuplicateResourceException;
import com.placement.campusplacement.exception.ResourceNotFoundException;
import com.placement.campusplacement.repository.ApplicationRepository;
import com.placement.campusplacement.repository.PlacementDriveRepository;
import com.placement.campusplacement.repository.RoundResultRepository;
import com.placement.campusplacement.repository.SelectionRoundRepository;
import com.placement.campusplacement.service.SelectionRoundService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SelectionRoundServiceImpl implements SelectionRoundService {

    private final SelectionRoundRepository roundRepository;
    private final RoundResultRepository resultRepository;
    private final PlacementDriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;

    public SelectionRoundServiceImpl(SelectionRoundRepository roundRepository,
                                     RoundResultRepository resultRepository,
                                     PlacementDriveRepository driveRepository,
                                     ApplicationRepository applicationRepository) {
        this.roundRepository = roundRepository;
        this.resultRepository = resultRepository;
        this.driveRepository = driveRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    @Transactional
    public SelectionRoundResponse createRound(SelectionRoundRequest request) {
        PlacementDrive drive = driveRepository.findById(request.getDriveId())
                .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", request.getDriveId()));

        if (roundRepository.existsByDrive_DriveIdAndRoundNumber(drive.getDriveId(), request.getRoundNumber())) {
            throw new DuplicateResourceException("Round " + request.getRoundNumber() + " already exists for this drive.");
        }

        SelectionRound round = new SelectionRound();
        round.setDrive(drive);
        round.setRoundNumber(request.getRoundNumber());
        round.setRoundName(request.getRoundName().trim());
        round.setRoundDescription(request.getRoundDescription());
        round.setScheduledAt(request.getScheduledAt());
        round.setRoundStatus(request.getRoundStatus() != null ? request.getRoundStatus().toUpperCase() : "PENDING");

        SelectionRound saved = roundRepository.save(round);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SelectionRoundResponse> getRoundsByDrive(Long driveId) {
        if (!driveRepository.existsById(driveId)) {
            throw new ResourceNotFoundException("PlacementDrive", "id", driveId);
        }
        return roundRepository.findByDriveIdOrderByRoundNumberAsc(driveId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SelectionRoundResponse getRoundById(Long roundId) {
        SelectionRound round = roundRepository.findByIdWithDetails(roundId)
                .orElseThrow(() -> new ResourceNotFoundException("SelectionRound", "id", roundId));
        return mapToResponse(round);
    }

    @Override
    @Transactional
    public RoundResultResponse recordRoundResult(RoundResultRequest request) {
        Application application = applicationRepository.findByIdWithDetails(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", request.getApplicationId()));

        SelectionRound round = roundRepository.findByIdWithDetails(request.getRoundId())
                .orElseThrow(() -> new ResourceNotFoundException("SelectionRound", "id", request.getRoundId()));

        // Verify round belongs to the application's drive
        if (!round.getDrive().getDriveId().equals(application.getDrive().getDriveId())) {
            throw new BusinessRuleException("The round does not belong to the drive for which the student applied.");
        }

        // Sequential qualification rule: if round > 1, check previous round
        if (round.getRoundNumber() > 1) {
            int previousRoundNum = round.getRoundNumber() - 1;
            List<RoundResult> results = resultRepository.findByApplicationIdWithDetails(application.getApplicationId());
            boolean qualifiedPrev = results.stream()
                    .anyMatch(r -> r.getRound().getRoundNumber() == previousRoundNum &&
                                   "QUALIFIED".equalsIgnoreCase(r.getResultStatus()));
            if (!qualifiedPrev) {
                throw new BusinessRuleException("Candidate must have QUALIFIED Round " + previousRoundNum +
                                                " before receiving results for Round " + round.getRoundNumber() + ".");
            }
        }

        String status = request.getResultStatus().toUpperCase();

        Optional<RoundResult> existingOpt =
                resultRepository.findByApplication_ApplicationIdAndRound_RoundId(application.getApplicationId(), round.getRoundId());

        RoundResult result = existingOpt.orElseGet(RoundResult::new);
        result.setApplication(application);
        result.setRound(round);
        result.setResultStatus(status);
        result.setScore(request.getScore());
        result.setRemarks(request.getRemarks());

        RoundResult saved = resultRepository.save(result);

        // Update application lifecycle
        if ("REJECTED".equals(status)) {
            application.setStatus("REJECTED");
            applicationRepository.save(application);
        } else if ("QUALIFIED".equals(status)) {
            // Check if this was the last round in this drive
            List<SelectionRound> allRounds = roundRepository.findByDriveIdOrderByRoundNumberAsc(round.getDrive().getDriveId());
            int maxRound = allRounds.stream().mapToInt(SelectionRound::getRoundNumber).max().orElse(1);
            if (round.getRoundNumber() == maxRound) {
                application.setStatus("SELECTED");
                applicationRepository.save(application);
            } else {
                application.setStatus("UNDER_REVIEW");
                applicationRepository.save(application);
            }
        }

        return mapToResultResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoundResultResponse> getResultsByRound(Long roundId) {
        if (!roundRepository.existsById(roundId)) {
            throw new ResourceNotFoundException("SelectionRound", "id", roundId);
        }
        return resultRepository.findByRoundIdWithDetails(roundId)
                .stream()
                .map(this::mapToResultResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoundResultResponse> getResultsByApplication(Long applicationId) {
        if (!applicationRepository.existsById(applicationId)) {
            throw new ResourceNotFoundException("Application", "id", applicationId);
        }
        return resultRepository.findByApplicationIdWithDetails(applicationId)
                .stream()
                .map(this::mapToResultResponse)
                .toList();
    }

    private SelectionRoundResponse mapToResponse(SelectionRound round) {
        SelectionRoundResponse res = new SelectionRoundResponse();
        res.setRoundId(round.getRoundId());
        res.setDriveId(round.getDrive().getDriveId());
        res.setDriveTitle(round.getDrive().getDriveTitle());
        res.setCompanyName(round.getDrive().getCompany().getCompanyName());
        res.setRoundNumber(round.getRoundNumber());
        res.setRoundName(round.getRoundName());
        res.setRoundDescription(round.getRoundDescription());
        res.setScheduledAt(round.getScheduledAt());
        res.setRoundStatus(round.getRoundStatus());
        res.setCreatedAt(round.getCreatedAt());
        return res;
    }

    private RoundResultResponse mapToResultResponse(RoundResult result) {
        RoundResultResponse res = new RoundResultResponse();
        res.setResultId(result.getResultId());
        res.setApplicationId(result.getApplication().getApplicationId());
        res.setStudentId(result.getApplication().getStudent().getStudentId());
        res.setStudentName(result.getApplication().getStudent().getUser().getFullName());
        res.setUsn(result.getApplication().getStudent().getUsn());
        res.setRoundId(result.getRound().getRoundId());
        res.setRoundNumber(result.getRound().getRoundNumber());
        res.setRoundName(result.getRound().getRoundName());
        res.setResultStatus(result.getResultStatus());
        res.setScore(result.getScore());
        res.setRemarks(result.getRemarks());
        res.setRecordedAt(result.getRecordedAt());
        return res;
    }
}

