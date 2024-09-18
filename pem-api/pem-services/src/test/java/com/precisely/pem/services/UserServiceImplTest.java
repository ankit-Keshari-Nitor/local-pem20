package com.precisely.pem.services;

import com.precisely.pem.commonUtil.PaginationRequest;
import com.precisely.pem.enums.UserSortBy;
import com.precisely.pem.dtos.requests.UserRequest;
import com.precisely.pem.dtos.responses.SponsorInfo;
import com.precisely.pem.dtos.responses.UserPaginationResponse;
import com.precisely.pem.dtos.responses.UserResponse;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.models.Participant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class UserServiceImplTest extends BaseServiceTest{
    @InjectMocks
    protected UserServiceImpl userService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        TenantContext.setTenantContext(SponsorInfo.builder().sponsorKey(TEST_SPONSOR).build());
    }

    @Test
    public void getUsers_WithoutFilter_Success() throws ResourceNotFoundException {
        List<UserResponse> userResponses = new ArrayList<>();
        userResponses.add( getUserResponseDefault("first"));
        userResponses.add( getUserResponseDefault("second"));
        Page<UserResponse> userResponsePage = new PageImpl<>(userResponses);
        UserRequest userRequest = getUserRequest();

        mockFindUsersCustom(userResponsePage);
        mockParticipantFindById(Participant.builder().isSponsorUser("y").build());

        UserPaginationResponse resp = userService.findUsers(userRequest, getPageReq());
        assertNotNull(resp);
        assertEquals(2,resp.getPageContent().getTotalElements());
        assertEquals(TEST_USER_KEY+"first",resp.getContent().get(0).getUserKey());
    }

    @Test
    public void getUsers_AllFilter_Success() throws ResourceNotFoundException {

        Page<UserResponse> userResponsePage = new PageImpl<>(Arrays.asList(
                getUserResponseDefault("first"),
                getUserResponseDefault("second")));

        mockFindUsersCustom(userResponsePage);
        mockParticipantFindById(Participant.builder().isSponsorUser("y").build());

        UserRequest userRequest = getUserRequest();
        userRequest.setUserKey(TEST_USER_KEY);
        userRequest.setUserName(TEST_USER_NAME);
        userRequest.setEmail(TEST_EMAIL);
        userRequest.setFirstName(TEST_FIRST_NAME);
        userRequest.setLastName(TEST_LAST_NAME);

        UserPaginationResponse resp = userService.findUsers(userRequest, getPageReq());
        assertNotNull(resp);
        assertEquals(2,resp.getPageContent().getTotalElements());
    }

    @Test
    public void getUsers_UserKeyFilter_Success() throws ResourceNotFoundException {
        Page<UserResponse> userResponsePage = new PageImpl<>(Arrays.asList(
                getUserResponseDefault("first"),
                getUserResponseDefault("second")));

        mockFindUsersCustom(userResponsePage);
        mockParticipantFindById(Participant.builder().isSponsorUser("y").build());

        UserRequest userRequest = getUserRequest();
        userRequest.setUserKey(TEST_USER_KEY);

        UserPaginationResponse resp = userService.findUsers(userRequest, getPageReq());
        assertNotNull(resp);
        assertEquals(2,resp.getPageContent().getTotalElements());
    }

    @Test
    public void getUsers_UserNameFilter_Success() throws ResourceNotFoundException {
        Page<UserResponse> userResponsePage = new PageImpl<>(Arrays.asList(
                getUserResponseDefault("first"),
                getUserResponseDefault("second")));

        mockFindUsersCustom(userResponsePage);
        mockParticipantFindById(Participant.builder().isSponsorUser("y").build());

        UserRequest userRequest = getUserRequest();
        userRequest.setUserName(TEST_USER_NAME);

        UserPaginationResponse resp = userService.findUsers(userRequest, getPageReq());
        assertNotNull(resp);
        assertEquals(2,resp.getPageContent().getTotalElements());
    }

    @Test
    public void getUsers_UserNameSorting_Success() throws ResourceNotFoundException {
        Page<UserResponse> userResponsePage = new PageImpl<>(Arrays.asList(
                getUserResponseDefault("first"),
                getUserResponseDefault("second")));

        mockFindUsersCustom(userResponsePage);
        mockParticipantFindById(Participant.builder().isSponsorUser("y").build());

        UserRequest userRequest = getUserRequest();
        userRequest.setUserName(TEST_USER_NAME);

        PaginationRequest paginationRequest = getPageReq();
        paginationRequest.setSortBy(UserSortBy.userName.getName());
        UserPaginationResponse resp = userService.findUsers(userRequest,paginationRequest);
        assertNotNull(resp);
        assertEquals(2,resp.getPageContent().getTotalElements());
    }

    @Test
    public void getUsers_NoData_Success() throws ResourceNotFoundException {
        Page<UserResponse> userResponsePage = new PageImpl<>(new ArrayList<>());

        mockFindUsersCustom(userResponsePage);
        mockParticipantFindById(Participant.builder().isSponsorUser("y").build());

        UserRequest userRequest = UserRequest.builder().build();

        UserPaginationResponse resp = userService.findUsers(userRequest, getPageReq());
        assertNotNull(resp);
        assertEquals(0,resp.getPageContent().getTotalElements());
    }

    public void getUsers_WithPartnerUserLogin_Success() throws ResourceNotFoundException {
       //TODO
    }
}
