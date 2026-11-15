package com.placement.campusplacement.controller;

import com.placement.campusplacement.dto.ApiResponse;
import com.placement.campusplacement.dto.InterviewFeedbackResponse;
import com.placement.campusplacement.dto.request.InterviewFeedbackRequest;
import com.placement.campusplacement.service.InterviewFeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
public class InterviewFeedbackController {

    private final InterviewFeedbackService feedbackService;

    public InterviewFeedbackController(InterviewFeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    /**
     * GET /api/feedbacks
     * Retrieve interview experiences, filterable by company name and graduation year.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<InterviewFeedbackResponse>>> getAllFeedbacks(
            @RequestParam(required = false) String company,
            @RequestParam(required = false) Integer year) {
        List<InterviewFeedbackResponse> list = feedbackService.getAllFeedbacks(company, year);
        return ResponseEntity.ok(ApiResponse.success("Interview experiences retrieved successfully", list));
    }

    /**
     * GET /api/feedbacks/{id}
     * Retrieve single interview feedback by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InterviewFeedbackResponse>> getFeedbackById(@PathVariable Long id) {
        InterviewFeedbackResponse res = feedbackService.getFeedbackById(id);
        return ResponseEntity.ok(ApiResponse.success("Interview experience retrieved successfully", res));
    }

    /**
     * POST /api/feedbacks
     * Submit a student's past interview experience.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<InterviewFeedbackResponse>> submitFeedback(
            @Valid @RequestBody InterviewFeedbackRequest request) {
        InterviewFeedbackResponse created = feedbackService.submitFeedback(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Interview experience submitted successfully", created));
    }
}

