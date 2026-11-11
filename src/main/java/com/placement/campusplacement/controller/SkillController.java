package com.placement.campusplacement.controller;

import com.placement.campusplacement.dto.ApiResponse;
import com.placement.campusplacement.dto.SkillResponse;
import com.placement.campusplacement.dto.request.SkillCreateRequest;
import com.placement.campusplacement.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for skills catalog management.
 */
@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    /**
     * GET /api/skills
     * Retrieve all available skills.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillResponse>>> getAllSkills() {
        List<SkillResponse> skills = skillService.getAllSkills();
        return ResponseEntity.ok(ApiResponse.success("Skills retrieved successfully", skills));
    }

    /**
     * GET /api/skills/{id}
     * Retrieve a skill by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SkillResponse>> getSkillById(@PathVariable Long id) {
        SkillResponse skill = skillService.getSkillById(id);
        return ResponseEntity.ok(ApiResponse.success("Skill retrieved successfully", skill));
    }

    /**
     * POST /api/skills
     * Create a new skill in the catalog.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<SkillResponse>> createSkill(
            @Valid @RequestBody SkillCreateRequest request) {
        SkillResponse created = skillService.createSkill(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Skill created successfully", created));
    }
}
