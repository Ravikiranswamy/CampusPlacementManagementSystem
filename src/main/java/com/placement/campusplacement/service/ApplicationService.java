package com.placement.campusplacement.service;

import com.placement.campusplacement.dto.ApplicationResponse;
import com.placement.campusplacement.dto.request.ApplicationRequest;
import com.placement.campusplacement.dto.request.ApplicationStatusUpdateRequest;

import java.util.List;

public interface ApplicationService {

    ApplicationResponse applyForDrive(ApplicationRequest request);

    List<ApplicationResponse> getApplicationsByStudent(Long studentId);

    List<ApplicationResponse> getApplicationsByDrive(Long driveId);

    ApplicationResponse getApplicationById(Long applicationId);

    ApplicationResponse updateApplicationStatus(Long applicationId, ApplicationStatusUpdateRequest request);

    void withdrawApplication(Long applicationId, Long studentId);

    List<ApplicationResponse> getAllApplications();
}
