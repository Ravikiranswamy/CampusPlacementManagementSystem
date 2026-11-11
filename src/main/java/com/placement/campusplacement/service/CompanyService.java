package com.placement.campusplacement.service;

import com.placement.campusplacement.dto.CompanyResponse;
import com.placement.campusplacement.dto.request.CompanyRequest;

import java.util.List;

public interface CompanyService {

    List<CompanyResponse> getAllCompanies();

    CompanyResponse getCompanyById(Long id);

    CompanyResponse createCompany(CompanyRequest request);

    CompanyResponse updateCompany(Long id, CompanyRequest request);

    void toggleCompanyStatus(Long id);
}

