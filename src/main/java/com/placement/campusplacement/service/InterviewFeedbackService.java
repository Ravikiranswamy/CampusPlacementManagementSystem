package com.placement.campusplacement.service;

import com.placement.campusplacement.dto.InterviewFeedbackResponse;
import com.placement.campusplacement.dto.request.InterviewFeedbackRequest;

import java.util.List;

public interface InterviewFeedbackService {
    List<InterviewFeedbackResponse> getAllFeedbacks(String company, Integer year);
    InterviewFeedbackResponse getFeedbackById(Long id);
    InterviewFeedbackResponse submitFeedback(InterviewFeedbackRequest request);
}

