package com.placement.campusplacement.service.impl;

import com.placement.campusplacement.dto.InterviewFeedbackResponse;
import com.placement.campusplacement.dto.request.InterviewFeedbackRequest;
import com.placement.campusplacement.entity.Company;
import com.placement.campusplacement.entity.InterviewFeedback;
import com.placement.campusplacement.entity.Student;
import com.placement.campusplacement.exception.ResourceNotFoundException;
import com.placement.campusplacement.repository.CompanyRepository;
import com.placement.campusplacement.repository.InterviewFeedbackRepository;
import com.placement.campusplacement.repository.StudentRepository;
import com.placement.campusplacement.service.InterviewFeedbackService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InterviewFeedbackServiceImpl implements InterviewFeedbackService {

    private final InterviewFeedbackRepository feedbackRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;

    public InterviewFeedbackServiceImpl(InterviewFeedbackRepository feedbackRepository,
                                       StudentRepository studentRepository,
                                       CompanyRepository companyRepository) {
        this.feedbackRepository = feedbackRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewFeedbackResponse> getAllFeedbacks(String company, Integer year) {
        List<InterviewFeedback> list = feedbackRepository.findAllWithDetails();

        return list.stream()
                .filter(f -> company == null || company.isBlank() ||
                        f.getCompanyName().toLowerCase().contains(company.toLowerCase()))
                .filter(f -> year == null || f.getGraduationYear().equals(year))
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public InterviewFeedbackResponse getFeedbackById(Long id) {
        InterviewFeedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("InterviewFeedback", "id", id));
        return mapToResponse(feedback);
    }

    @Override
    @Transactional
    public InterviewFeedbackResponse submitFeedback(InterviewFeedbackRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getStudentId()));

        Company company = null;
        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId()).orElse(null);
        }

        InterviewFeedback feedback = new InterviewFeedback();
        feedback.setStudent(student);
        feedback.setCompany(company);
        feedback.setCompanyName(request.getCompanyName().trim());
        feedback.setRoleTitle(request.getRoleTitle().trim());
        feedback.setLocation(request.getLocation() != null ? request.getLocation().trim() : null);
        feedback.setGraduationYear(request.getGraduationYear());
        feedback.setInterviewMode(request.getInterviewMode() != null ? request.getInterviewMode() : "Online");
        feedback.setPackageCtc(request.getPackageCtc());
        feedback.setBasePay(request.getBasePay());
        feedback.setStipendMonthly(request.getStipendMonthly());
        feedback.setCodingRating(request.getCodingRating());
        feedback.setInterviewRating(request.getInterviewRating());
        feedback.setOverallRating(request.getOverallRating());
        feedback.setTechnicalRoundDesc(request.getTechnicalRoundDesc());
        feedback.setHrRoundDesc(request.getHrRoundDesc());
        feedback.setTopicsCovered(request.getTopicsCovered());
        feedback.setValuableTips(request.getValuableTips());

        InterviewFeedback saved = feedbackRepository.save(feedback);
        return mapToResponse(saved);
    }

    private InterviewFeedbackResponse mapToResponse(InterviewFeedback f) {
        InterviewFeedbackResponse res = new InterviewFeedbackResponse();
        res.setFeedbackId(f.getFeedbackId());

        if (f.getStudent() != null) {
            res.setStudentId(f.getStudent().getStudentId());
            res.setStudentUsn(f.getStudent().getUsn());
            if (f.getStudent().getUser() != null) {
                res.setStudentName(f.getStudent().getUser().getFullName());
            }
            if (f.getStudent().getDepartment() != null) {
                res.setDepartmentCode(f.getStudent().getDepartment().getDepartmentCode());
            }
        }

        if (f.getCompany() != null) {
            res.setCompanyId(f.getCompany().getCompanyId());
        }
        res.setCompanyName(f.getCompanyName());
        res.setRoleTitle(f.getRoleTitle());
        res.setLocation(f.getLocation());
        res.setGraduationYear(f.getGraduationYear());
        res.setInterviewMode(f.getInterviewMode());
        res.setPackageCtc(f.getPackageCtc());
        res.setBasePay(f.getBasePay());
        res.setStipendMonthly(f.getStipendMonthly());
        res.setCodingRating(f.getCodingRating());
        res.setInterviewRating(f.getInterviewRating());
        res.setOverallRating(f.getOverallRating());
        res.setTechnicalRoundDesc(f.getTechnicalRoundDesc());
        res.setHrRoundDesc(f.getHrRoundDesc());
        res.setTopicsCovered(f.getTopicsCovered());
        res.setValuableTips(f.getValuableTips());
        res.setCreatedAt(f.getCreatedAt());

        return res;
    }
}

