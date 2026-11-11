package com.placement.campusplacement.service;

import com.placement.campusplacement.dto.OfferResponse;
import com.placement.campusplacement.dto.request.OfferCreateRequest;
import com.placement.campusplacement.dto.request.OfferStatusUpdateRequest;

import java.util.List;

public interface OfferService {

    OfferResponse createOffer(OfferCreateRequest request);

    List<OfferResponse> getOffersByStudent(Long studentId);

    OfferResponse getOfferById(Long offerId);

    OfferResponse updateOfferStatus(Long offerId, OfferStatusUpdateRequest request);

    List<OfferResponse> getAllOffers();
}
