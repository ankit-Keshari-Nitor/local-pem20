package com.precisely.pem.controller;

import com.precisely.pem.enums.Application;
import com.precisely.pem.enums.DefinitionSortBy;
import com.precisely.pem.enums.SortDirection;
import com.precisely.pem.dtos.requests.ActivityDefnReq;
import com.precisely.pem.dtos.responses.ActivityDefnListResp;
import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.ActivityDefnResp;
import com.precisely.pem.dtos.responses.MessageResp;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

class ActivityControllerTest extends BaseControllerTest {

    @BeforeEach
    void setup() throws Exception{
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateActivityDefinition() throws Exception {
        ActivityDefnReq activityDefnReq = new ActivityDefnReq();
        ActivityDefnResp activityDefnResp = new ActivityDefnResp();

        when(activityDefnService.createActivityDefinition(anyString(), any(ActivityDefnReq.class)))
                .thenReturn(activityDefnResp);

        ActivityDefnReq req = new ActivityDefnReq();
        ResponseEntity<Object> response = activityController.createActivityDefinition(req,TEST_SPONSOR);
        assertEquals(response.getStatusCode(), HttpStatus.CREATED);
        assertEquals(response.getBody(),activityDefnResp);
    }

    @Test
    public void testGetActivityDefinitionList() throws Exception {
        // Given
        String sponsorContext = "testContext";
        String name = "testName";
        String description = "testDescription";
        List<String> status = Arrays.asList("ACTIVE");
        Application application = Application.PEM; // or new Application("PEM");
        int pageNo = 0;
        int pageSize = 10;
        DefinitionSortBy definitionSortBy = DefinitionSortBy.modifyTs;
        SortDirection sortDir = SortDirection.DESC;

        ActivityDefnPaginationRes res = new ActivityDefnPaginationRes();
        ActivityDefnListResp activityDefnRes = new ActivityDefnListResp();
        activityDefnRes.setActivityDefnKey("testKey");
        List<ActivityDefnListResp> activityDefnListRespList = new ArrayList<>();
        activityDefnListRespList.add(activityDefnRes);
        res.setContent(activityDefnListRespList);
        when(activityDefnService.getAllDefinitionList(anyString(), anyString(), anyString(), anyString(), anyList(), anyInt(), anyInt(), anyString(), anyString()))
                .thenReturn(res);

        // When
        ResponseEntity<Object> response = activityController.getActivityDefinitionList(name, description, status, application, pageNo, pageSize, definitionSortBy, sortDir, sponsorContext);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertInstanceOf(ActivityDefnPaginationRes.class, response.getBody());
        ActivityDefnPaginationRes responseBody = (ActivityDefnPaginationRes) response.getBody();
        assertNotNull(responseBody);
        assertFalse(responseBody.getContent().isEmpty());
        assertEquals(1, responseBody.getContent().size());
        assertEquals("testKey", responseBody.getContent().get(0).getActivityDefnKey());
    }

    @Test
    public void testGetActivityDefinitionByKey() throws Exception {
        ActivityDefnListResp activityDefnListResp = new ActivityDefnListResp();

        when(activityDefnService.getActivityDefinitionByKey(anyString(), anyString()))
                .thenReturn(activityDefnListResp);

        ResponseEntity<Object> response = activityController.getActivityDefinitionByKey("sponsor1", "123");

        assertEquals(response.getStatusCode(),HttpStatus.OK);
        assertEquals(response.getBody(),activityDefnListResp);
    }


    @Test
    void deleteActivityDefinitionById() throws Exception {
        when(activityDefnService.deleteActivityDefinitionByKey(anyString(), anyString()))
                .thenReturn(MessageResp.builder().build());

        ResponseEntity<Object> resp = activityController.deleteActivityDefinitionByKey(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY);
        assertNotNull(resp);
        assertEquals(resp.getStatusCode(), HttpStatus.OK);
    }
}