package com.placement.campusplacement.service;

import com.placement.campusplacement.dto.RestrictionResponse;
import com.placement.campusplacement.dto.request.RestrictionRequest;
import com.placement.campusplacement.dto.request.UnblockRequest;

import java.util.List;

public interface RestrictionService {

    RestrictionResponse blockStudent(RestrictionRequest request);

    RestrictionResponse unblockStudent(Long restrictionId, UnblockRequest request);

    List<RestrictionResponse> getAllRestrictions();

    List<RestrictionResponse> getStudentRestrictionHistory(Long studentId);
}
