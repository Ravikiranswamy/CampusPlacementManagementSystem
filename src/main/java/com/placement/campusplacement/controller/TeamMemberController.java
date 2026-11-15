package com.placement.campusplacement.controller;

import com.placement.campusplacement.dto.ApiResponse;
import com.placement.campusplacement.dto.UserResponse;
import com.placement.campusplacement.dto.request.CreateTeamMemberRequest;
import com.placement.campusplacement.service.TeamMemberService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Placement Team Member management.
 * Used by the Placement Officer to view, create, activate/deactivate,
 * and manage Placement Team accounts.
 */
@RestController
@RequestMapping("/api/team-members")
public class TeamMemberController {

    private final TeamMemberService teamMemberService;

    public TeamMemberController(TeamMemberService teamMemberService) {
        this.teamMemberService = teamMemberService;
    }

    /**
     * GET /api/team-members
     * Retrieve all users with role PLACEMENT_TEAM.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllTeamMembers() {
        List<UserResponse> members = teamMemberService.getAllTeamMembers();
        return ResponseEntity.ok(ApiResponse.success("Placement team members retrieved successfully", members));
    }

    /**
     * POST /api/team-members
     * Add a new Placement Team member with their institutional email and password.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createTeamMember(
            @Valid @RequestBody CreateTeamMemberRequest request) {
        UserResponse created = teamMemberService.createTeamMember(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Placement team member created successfully", created));
    }

    /**
     * PUT /api/team-members/{id}/toggle-status
     * Toggle active/inactive status for a team member account.
     */
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<UserResponse>> toggleStatus(@PathVariable Long id) {
        UserResponse updated = teamMemberService.toggleTeamMemberStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Team member status updated successfully", updated));
    }

    /**
     * DELETE /api/team-members/{id}
     * Remove a team member.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTeamMember(@PathVariable Long id) {
        teamMemberService.deleteTeamMember(id);
        return ResponseEntity.ok(ApiResponse.success("Team member removed successfully", null));
    }
}

