package com.placement.campusplacement.repository;

import com.placement.campusplacement.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    boolean existsByCompanyNameIgnoreCase(String companyName);

    Optional<Company> findByCompanyNameIgnoreCase(String companyName);

    List<Company> findByIsActiveTrue();
}

