package com.placement.campusplacement.service.impl;

import com.placement.campusplacement.dto.JobRoleResponse;
import com.placement.campusplacement.dto.request.JobRoleRequest;
import com.placement.campusplacement.entity.Company;
import com.placement.campusplacement.entity.JobRole;
import com.placement.campusplacement.exception.ResourceNotFoundException;
import com.placement.campusplacement.repository.CompanyRepository;
import com.placement.campusplacement.repository.JobRoleRepository;
import com.placement.campusplacement.service.JobRoleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class JobRoleServiceImpl implements JobRoleService {

    private final JobRoleRepository jobRoleRepository;
    private final CompanyRepository companyRepository;

    public JobRoleServiceImpl(JobRoleRepository jobRoleRepository, CompanyRepository companyRepository) {
        this.jobRoleRepository = jobRoleRepository;
        this.companyRepository = companyRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobRoleResponse> getAllJobRoles() {
        return jobRoleRepository.findAllWithDetails()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobRoleResponse> getJobRolesByCompanyId(Long companyId) {
        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException("Company", "id", companyId);
        }
        return jobRoleRepository.findByCompanyIdWithDetails(companyId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public JobRoleResponse getJobRoleById(Long id) {
        JobRole jobRole = jobRoleRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobRole", "id", id));
        return mapToResponse(jobRole);
    }

    @Override
    @Transactional
    public JobRoleResponse createJobRole(JobRoleRequest request) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", request.getCompanyId()));

        JobRole jobRole = new JobRole();
        jobRole.setCompany(company);
        jobRole.setRoleTitle(request.getRoleTitle().trim());
        jobRole.setJobType(request.getJobType().toUpperCase());
        jobRole.setPackageLpa(request.getPackageLpa());
        jobRole.setWorkLocation(request.getWorkLocation());
        jobRole.setJobDescription(request.getJobDescription());
        jobRole.setIsActive(true);

        JobRole saved = jobRoleRepository.save(jobRole);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public JobRoleResponse updateJobRole(Long id, JobRoleRequest request) {
        JobRole jobRole = jobRoleRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobRole", "id", id));

        if (!jobRole.getCompany().getCompanyId().equals(request.getCompanyId())) {
            Company company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company", "id", request.getCompanyId()));
            jobRole.setCompany(company);
        }

        jobRole.setRoleTitle(request.getRoleTitle().trim());
        jobRole.setJobType(request.getJobType().toUpperCase());
        jobRole.setPackageLpa(request.getPackageLpa());
        jobRole.setWorkLocation(request.getWorkLocation());
        jobRole.setJobDescription(request.getJobDescription());

        JobRole updated = jobRoleRepository.save(jobRole);
        return mapToResponse(updated);
    }

    private JobRoleResponse mapToResponse(JobRole jobRole) {
        return new JobRoleResponse(
                jobRole.getJobRoleId(),
                jobRole.getCompany().getCompanyId(),
                jobRole.getCompany().getCompanyName(),
                jobRole.getRoleTitle(),
                jobRole.getJobType(),
                jobRole.getPackageLpa(),
                jobRole.getWorkLocation(),
                jobRole.getJobDescription(),
                jobRole.getIsActive(),
                jobRole.getCreatedAt()
        );
    }
}
