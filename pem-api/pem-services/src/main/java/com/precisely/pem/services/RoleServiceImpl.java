package com.precisely.pem.services;

import com.precisely.pem.commonUtil.PaginationRequest;
import com.precisely.pem.dtos.constants.RoleScopes;
import com.precisely.pem.dtos.responses.GetUserRoleResponse;
import com.precisely.pem.dtos.responses.SponsorInfo;
import com.precisely.pem.dtos.shared.PaginationDto;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.models.Participant;
import com.precisely.pem.models.Role;
import com.precisely.pem.repositories.ParticipantRepo;
import com.precisely.pem.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RoleServiceImpl implements RoleService{
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ParticipantRepo participantRepo;

    //TODO will change once identity server code is present
    @Value("${participant-key}")
    private String participantKey;

    @Override
    public GetUserRoleResponse getUserRoles(PaginationRequest getUserRoleRequest) {
        Sort sort = getUserRoleRequest.getSortDir().equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by( getUserRoleRequest.getSortBy()).ascending()
                : Sort.by(getUserRoleRequest.getSortBy()).descending();
        Pageable pageable = PageRequest.of(getUserRoleRequest.getPageNo(), getUserRoleRequest.getPageSize(), sort);

        SponsorInfo sponsorInfo = TenantContext.getTenantContext();
        List<String> roleScopes = new ArrayList<>();

        addRoleScopesFilter(roleScopes,participantKey);

        Page<Role> roles = roleRepository.findBySponsorKeyAndRoleScopeIn(sponsorInfo.getSponsorKey(),roleScopes,pageable);
        List<GetUserRoleResponse.RoleResponse> roleResponses = new ArrayList<>();
        roles.get().forEach(role -> roleResponses.add(GetUserRoleResponse.RoleResponse.builder()
                .roleKey(role.getRoleKey())
                .type(role.getRoleType())
                .name(role.getRoleName()).build()));

        return GetUserRoleResponse.builder()
                .content(roleResponses)
                .pageContent(PaginationDto.builder()
                        .totalElements(roles.getTotalElements())
                        .totalPages(roles.getTotalPages())
                        .number(roles.getNumber())
                        .size(roles.getSize())
                        .build()).build();
    }

    private void addRoleScopesFilter(List<String> roleScopes,String participantKey) {
        Optional<Participant> participant = participantRepo.findById(participantKey);
        if(participant.isEmpty()){
            return;
        }
        if (participant.get().getIsSponsorUser().equalsIgnoreCase("y")){
            roleScopes.add(RoleScopes.PARTNER.getName());
            roleScopes.add(RoleScopes.SPONSOR.getName());
            roleScopes.add(RoleScopes.DIVISION.getName());
        }else if(participant.get().getIsSponsorUser().equalsIgnoreCase("n")){
            roleScopes.add(RoleScopes.PARTNER.getName());
        }
    }
}
