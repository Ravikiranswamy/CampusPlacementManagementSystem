package com.placement.campusplacement.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * JPA entity mapping the 'interview_feedbacks' table in Neon PostgreSQL.
 * Captures past students' interview experiences, round breakdowns, ratings, and preparation tips.
 */
@Entity
@Table(name = "interview_feedbacks")
public class InterviewFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Long feedbackId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(name = "role_title", nullable = false, length = 150)
    private String roleTitle;

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "graduation_year", nullable = false)
    private Integer graduationYear;

    @Column(name = "interview_mode", nullable = false, length = 20)
    private String interviewMode = "Online";

    @Column(name = "package_ctc", precision = 6, scale = 2)
    private BigDecimal packageCtc;

    @Column(name = "base_pay", precision = 6, scale = 2)
    private BigDecimal basePay;

    @Column(name = "stipend_monthly", precision = 8, scale = 2)
    private BigDecimal stipendMonthly;

    @Column(name = "coding_rating")
    private Integer codingRating;

    @Column(name = "interview_rating")
    private Integer interviewRating;

    @Column(name = "overall_rating")
    private Integer overallRating;

    @Column(name = "technical_round_desc", columnDefinition = "TEXT")
    private String technicalRoundDesc;

    @Column(name = "hr_round_desc", columnDefinition = "TEXT")
    private String hrRoundDesc;

    @Column(name = "topics_covered", columnDefinition = "TEXT")
    private String topicsCovered;

    @Column(name = "valuable_tips", columnDefinition = "TEXT")
    private String valuableTips;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public InterviewFeedback() {}

    public Long getFeedbackId() { return feedbackId; }
    public Student getStudent() { return student; }
    public Company getCompany() { return company; }
    public String getCompanyName() { return companyName; }
    public String getRoleTitle() { return roleTitle; }
    public String getLocation() { return location; }
    public Integer getGraduationYear() { return graduationYear; }
    public String getInterviewMode() { return interviewMode; }
    public BigDecimal getPackageCtc() { return packageCtc; }
    public BigDecimal getBasePay() { return basePay; }
    public BigDecimal getStipendMonthly() { return stipendMonthly; }
    public Integer getCodingRating() { return codingRating; }
    public Integer getInterviewRating() { return interviewRating; }
    public Integer getOverallRating() { return overallRating; }
    public String getTechnicalRoundDesc() { return technicalRoundDesc; }
    public String getHrRoundDesc() { return hrRoundDesc; }
    public String getTopicsCovered() { return topicsCovered; }
    public String getValuableTips() { return valuableTips; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setFeedbackId(Long feedbackId) { this.feedbackId = feedbackId; }
    public void setStudent(Student student) { this.student = student; }
    public void setCompany(Company company) { this.company = company; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }
    public void setLocation(String location) { this.location = location; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }
    public void setInterviewMode(String interviewMode) { this.interviewMode = interviewMode; }
    public void setPackageCtc(BigDecimal packageCtc) { this.packageCtc = packageCtc; }
    public void setBasePay(BigDecimal basePay) { this.basePay = basePay; }
    public void setStipendMonthly(BigDecimal stipendMonthly) { this.stipendMonthly = stipendMonthly; }
    public void setCodingRating(Integer codingRating) { this.codingRating = codingRating; }
    public void setInterviewRating(Integer interviewRating) { this.interviewRating = interviewRating; }
    public void setOverallRating(Integer overallRating) { this.overallRating = overallRating; }
    public void setTechnicalRoundDesc(String technicalRoundDesc) { this.technicalRoundDesc = technicalRoundDesc; }
    public void setHrRoundDesc(String hrRoundDesc) { this.hrRoundDesc = hrRoundDesc; }
    public void setTopicsCovered(String topicsCovered) { this.topicsCovered = topicsCovered; }
    public void setValuableTips(String valuableTips) { this.valuableTips = valuableTips; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

