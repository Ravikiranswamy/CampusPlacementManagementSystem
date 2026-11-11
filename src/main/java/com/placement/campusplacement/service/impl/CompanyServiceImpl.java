package com.placement.campusplacement.service.impl;

import com.placement.campusplacement.dto.CompanyResponse;
import com.placement.campusplacement.dto.request.CompanyRequest;
import com.placement.campusplacement.entity.Company;
import com.placement.campusplacement.exception.DuplicateResourceException;
import com.placement.campusplacement.exception.ResourceNotFoundException;
import com.placement.campusplacement.repository.CompanyRepository;
import com.placement.campusplacement.service.CompanyService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyServiceImpl(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyResponse> getAllCompanies() {
        return companyRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
        return mapToResponse(company);
    }

    @Override
    @Transactional
    public CompanyResponse createCompany(CompanyRequest request) {
        String name = request.getCompanyName().trim();
        if (companyRepository.existsByCompanyNameIgnoreCase(name)) {
            throw new DuplicateResourceException("Company with name '" + name + "' already exists.");
        }

        Company company = new Company();
        company.setCompanyName(name);
        company.setIndustry(request.getIndustry());
        company.setWebsite(request.getWebsite());
        company.setContactEmail(request.getContactEmail().trim().toLowerCase());
        company.setContactPhone(request.getContactPhone());
        company.setAddress(request.getAddress());
        company.setDescription(request.getDescription());
        company.setIsActive(true);

        Company saved = companyRepository.save(company);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public CompanyResponse updateCompany(Long id, CompanyRequest request) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));

        String name = request.getCompanyName().trim();
        if (!company.getCompanyName().equalsIgnoreCase(name) && companyRepository.existsByCompanyNameIgnoreCase(name)) {
            throw new DuplicateResourceException("Company with name '" + name + "' already exists.");
        }

        company.setCompanyName(name);
        company.setIndustry(request.getIndustry());
        company.setWebsite(request.getWebsite());
        company.setContactEmail(request.getContactEmail().trim().toLowerCase());
        company.setContactPhone(request.getContactPhone());
        company.setAddress(request.getAddress());
        company.setDescription(request.getDescription());

        Company updated = companyRepository.save(company);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void toggleCompanyStatus(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
        company.setIsActive(!company.getIsActive());
        companyRepository.save(company);
    }

    private CompanyResponse mapToResponse(Company company) {
        return new CompanyResponse(
                company.getCompanyId(),
                company.getCompanyName(),
                company.getIndustry(),
                company.getWebsite(),
                company.getContactEmail(),
                company.getContactPhone(),
                company.getAddress(),
                company.getDescription(),
                company.getIsActive(),
                company.getCreatedAt()
        );
    }
}

