package com.placement.campusplacement.controller;

import com.placement.campusplacement.dto.ApiResponse;
import com.placement.campusplacement.dto.DepartmentResponse;
import com.placement.campusplacement.repository.DepartmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    public DepartmentController(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getAllDepartments() {
        List<DepartmentResponse> list = departmentRepository.findAll()
                .stream()
                .map(d -> new DepartmentResponse(
                        d.getDepartmentId(),
                        d.getDepartmentCode(),
                        d.getDepartmentName(),
                        d.getHodName(),
                        d.getOfficeEmail(),
                        d.getCreatedAt()
                ))
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Departments retrieved successfully", list));
    }
}
