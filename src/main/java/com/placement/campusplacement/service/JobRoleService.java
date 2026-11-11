package com.placement.campusplacement.service;

import com.placement.campusplacement.dto.JobRoleResponse;
import com.placement.campusplacement.dto.request.JobRoleRequest;

import java.util.List;

public interface JobRoleService {

    List<JobRoleResponse> getAllJobRoles();

    List<JobRoleResponse> getJobRolesByCompanyId(Long companyId);

    JobRoleResponse getJobRoleById(Long id);

    JobRoleResponse createJobRole(JobRoleRequest request);

    JobRoleResponse updateJobRole(Long id, JobRoleRequest request);
}

