package com.placement.campusplacement.service;

import com.placement.campusplacement.dto.SkillResponse;
import com.placement.campusplacement.dto.request.SkillCreateRequest;

import java.util.List;

public interface SkillService {

    List<SkillResponse> getAllSkills();

    SkillResponse getSkillById(Long skillId);

    SkillResponse createSkill(SkillCreateRequest request);
}
