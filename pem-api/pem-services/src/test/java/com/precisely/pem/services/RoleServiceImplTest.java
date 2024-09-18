package com.precisely.pem.services;

import com.precisely.pem.commonUtil.PaginationRequest;
import com.precisely.pem.enums.RoleSortBy;
import com.precisely.pem.dtos.responses.GetUserRoleResponse;
import com.precisely.pem.dtos.responses.SponsorInfo;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.models.Participant;
import com.precisely.pem.models.Role;
import com.precisely.pem.repositories.RoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.mockito.stubbing.OngoingStubbing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class RoleServiceImplTest extends BaseServiceTest {

    @InjectMocks
    RoleServiceImpl roleService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        TenantContext.setTenantContext(SponsorInfo.builder().sponsorKey(TEST_SPONSOR).build());
    }

    @Test
    public void getRoles_WithoutFilter_Success(){
        Role role = getRole();
        mockParticipantFindById(Participant.builder().isSponsorUser("y").build());
        mockFindBySponsorKeyAndRoleScope()
                .thenReturn(new PageImpl<>(Collections.singletonList(role)));

        GetUserRoleResponse response = roleService.getUserRoles(getPageReq());
        assertNotNull(response);
        assertEquals(1,response.getPageContent().getTotalElements());
        assertEquals(TEST_ROLE_NAME,response.getContent().get(0).getName());
    }

    @Test
    public void getRoles_WithFilter_Success(){
        Role role = getRole();
        mockParticipantFindById(Participant.builder().isSponsorUser("y").build());
        mockFindBySponsorKeyAndRoleScope()
                .thenReturn(new PageImpl<>(Collections.singletonList(role)));
        PaginationRequest paginationRequest = getPageReq();
        paginationRequest.setSortBy(RoleSortBy.roleName.getName());
        GetUserRoleResponse response = roleService.getUserRoles(paginationRequest);
        assertNotNull(response);
        assertEquals(1,response.getPageContent().getTotalElements());
        assertEquals(TEST_ROLE_NAME,response.getContent().get(0).getName());
    }

    private OngoingStubbing<Page<Role>> mockFindBySponsorKeyAndRoleScope() {
        return Mockito.when(roleRepository
                .findBySponsorKeyAndRoleScopeIn(ArgumentMatchers.anyString(), ArgumentMatchers.anyList(), ArgumentMatchers.any()));
    }

    private static Role getRole() {
        return Role.builder().roleKey(TEST_ROLE_KEY).roleName(TEST_ROLE_NAME).roleType(TEST_ROLE_TYPE).build();
    }

}
