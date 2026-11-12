package com.placement.campusplacement.controller;

import com.placement.campusplacement.dto.ApiResponse;
import com.placement.campusplacement.dto.OfferResponse;
import com.placement.campusplacement.dto.request.OfferCreateRequest;
import com.placement.campusplacement.dto.request.OfferStatusUpdateRequest;
import com.placement.campusplacement.service.OfferService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    private final OfferService offerService;

    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OfferResponse>> createOffer(
            @Valid @RequestBody OfferCreateRequest request) {
        OfferResponse created = offerService.createOffer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Offer issued successfully", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OfferResponse>>> getAllOffers() {
        List<OfferResponse> list = offerService.getAllOffers();
        return ResponseEntity.ok(ApiResponse.success("Offers retrieved successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OfferResponse>> getOfferById(@PathVariable Long id) {
        OfferResponse offer = offerService.getOfferById(id);
        return ResponseEntity.ok(ApiResponse.success("Offer retrieved successfully", offer));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<OfferResponse>>> getOffersByStudent(
            @PathVariable Long studentId) {
        List<OfferResponse> list = offerService.getOffersByStudent(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student offers retrieved successfully", list));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OfferResponse>> updateOfferStatus(
            @PathVariable Long id,
            @Valid @RequestBody OfferStatusUpdateRequest request) {
        OfferResponse updated = offerService.updateOfferStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Offer status updated successfully", updated));
    }
}

