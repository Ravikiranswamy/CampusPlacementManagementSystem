package com.placement.campusplacement.service.impl;

import com.placement.campusplacement.dto.SkillResponse;
import com.placement.campusplacement.dto.request.SkillCreateRequest;
import com.placement.campusplacement.entity.Skill;
import com.placement.campusplacement.exception.DuplicateResourceException;
import com.placement.campusplacement.exception.ResourceNotFoundException;
import com.placement.campusplacement.repository.SkillRepository;
import com.placement.campusplacement.service.SkillService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;

    public SkillServiceImpl(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillResponse> getAllSkills() {
        return skillRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SkillResponse getSkillById(Long skillId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", skillId));
        return mapToResponse(skill);
    }

    @Override
    @Transactional
    public SkillResponse createSkill(SkillCreateRequest request) {
        String name = request.getSkillName().trim();
        if (skillRepository.existsBySkillNameIgnoreCase(name)) {
            throw new DuplicateResourceException("Skill '" + name + "' already exists.");
        }

        Skill skill = new Skill();
        skill.setSkillName(name);
        skill.setCategory(request.getCategory() != null ? request.getCategory().trim() : "General");
        skill.setDescription(request.getDescription());
        skill.setIsActive(true);

        Skill saved = skillRepository.save(skill);
        return mapToResponse(saved);
    }

    private SkillResponse mapToResponse(Skill skill) {
        return new SkillResponse(
                skill.getSkillId(),
                skill.getSkillName(),
                skill.getCategory(),
                skill.getDescription(),
                skill.getIsActive(),
                skill.getCreatedAt()
        );
    }
}
