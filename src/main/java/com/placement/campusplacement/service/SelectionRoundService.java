package com.placement.campusplacement.service;

import com.placement.campusplacement.dto.RoundResultResponse;
import com.placement.campusplacement.dto.SelectionRoundResponse;
import com.placement.campusplacement.dto.request.RoundResultRequest;
import com.placement.campusplacement.dto.request.SelectionRoundRequest;

import java.util.List;

public interface SelectionRoundService {

    SelectionRoundResponse createRound(SelectionRoundRequest request);

    List<SelectionRoundResponse> getRoundsByDrive(Long driveId);

    SelectionRoundResponse getRoundById(Long roundId);

    RoundResultResponse recordRoundResult(RoundResultRequest request);

    List<RoundResultResponse> getResultsByRound(Long roundId);

    List<RoundResultResponse> getResultsByApplication(Long applicationId);
}

