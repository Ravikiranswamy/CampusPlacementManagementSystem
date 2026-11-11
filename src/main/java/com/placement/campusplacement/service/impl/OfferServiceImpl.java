package com.placement.campusplacement.service.impl;

import com.placement.campusplacement.dto.OfferResponse;
import com.placement.campusplacement.dto.request.OfferCreateRequest;
import com.placement.campusplacement.dto.request.OfferStatusUpdateRequest;
import com.placement.campusplacement.entity.Application;
import com.placement.campusplacement.entity.Offer;
import com.placement.campusplacement.exception.BusinessRuleException;
import com.placement.campusplacement.exception.DuplicateResourceException;
import com.placement.campusplacement.exception.ResourceNotFoundException;
import com.placement.campusplacement.repository.ApplicationRepository;
import com.placement.campusplacement.repository.OfferRepository;
import com.placement.campusplacement.repository.StudentRepository;
import com.placement.campusplacement.service.OfferService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class OfferServiceImpl implements OfferService {

    private final OfferRepository offerRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;

    public OfferServiceImpl(OfferRepository offerRepository,
                            ApplicationRepository applicationRepository,
                            StudentRepository studentRepository) {
        this.offerRepository = offerRepository;
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
    }

    @Override
    @Transactional
    public OfferResponse createOffer(OfferCreateRequest request) {
        Application application = applicationRepository.findByIdWithDetails(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", request.getApplicationId()));

        if (offerRepository.existsByApplication_ApplicationId(application.getApplicationId())) {
            throw new DuplicateResourceException("An offer has already been issued for this application.");
        }

        LocalDate offerDate = request.getOfferDate() != null ? request.getOfferDate() : LocalDate.now();
        if (request.getJoiningDate() != null && request.getJoiningDate().isBefore(offerDate)) {
            throw new BusinessRuleException("Joining date cannot be earlier than the offer date.");
        }

        Offer offer = new Offer();
        offer.setApplication(application);
        offer.setOfferedPackageLpa(request.getOfferedPackageLpa());
        offer.setOfferDate(offerDate);
        offer.setJoiningDate(request.getJoiningDate());
        offer.setOfferStatus("OFFERED");
        offer.setOfferLetterUrl(request.getOfferLetterUrl());
        offer.setAdditionalInfo(request.getAdditionalInfo());

        Offer saved = offerRepository.save(offer);

        // Mark application status as SELECTED
        application.setStatus("SELECTED");
        applicationRepository.save(application);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OfferResponse> getOffersByStudent(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student", "id", studentId);
        }
        return offerRepository.findByStudentIdWithDetails(studentId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OfferResponse getOfferById(Long offerId) {
        Offer offer = offerRepository.findByIdWithDetails(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", "id", offerId));
        return mapToResponse(offer);
    }

    @Override
    @Transactional
    public OfferResponse updateOfferStatus(Long offerId, OfferStatusUpdateRequest request) {
        Offer offer = offerRepository.findByIdWithDetails(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", "id", offerId));

        offer.setOfferStatus(request.getOfferStatus().toUpperCase());
        Offer updated = offerRepository.save(offer);
        return mapToResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OfferResponse> getAllOffers() {
        return offerRepository.findAllWithDetails()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private OfferResponse mapToResponse(Offer offer) {
        OfferResponse res = new OfferResponse();
        res.setOfferId(offer.getOfferId());
        res.setApplicationId(offer.getApplication().getApplicationId());
        res.setStudentId(offer.getApplication().getStudent().getStudentId());
        res.setStudentName(offer.getApplication().getStudent().getUser().getFullName());
        res.setEmail(offer.getApplication().getStudent().getUser().getEmail());
        res.setUsn(offer.getApplication().getStudent().getUsn());
        res.setDepartmentName(offer.getApplication().getStudent().getDepartment().getDepartmentName());

        res.setDriveId(offer.getApplication().getDrive().getDriveId());
        res.setDriveTitle(offer.getApplication().getDrive().getDriveTitle());
        res.setCompanyName(offer.getApplication().getDrive().getCompany().getCompanyName());
        res.setRoleTitle(offer.getApplication().getDrive().getJobRole().getRoleTitle());

        res.setOfferedPackageLpa(offer.getOfferedPackageLpa());
        res.setOfferDate(offer.getOfferDate());
        res.setJoiningDate(offer.getJoiningDate());
        res.setOfferStatus(offer.getOfferStatus());
        res.setOfferLetterUrl(offer.getOfferLetterUrl());
        res.setAdditionalInfo(offer.getAdditionalInfo());
        res.setCreatedAt(offer.getCreatedAt());

        return res;
    }
}
