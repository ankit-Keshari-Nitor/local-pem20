package com.precisely.pem.controller;

import com.precisely.pem.enums.DefinitionSortBy;
import com.precisely.pem.enums.InstStatus;
import com.precisely.pem.enums.InstanceSortBy;
import com.precisely.pem.enums.SortDirection;
import com.precisely.pem.dtos.requests.ActivityInstReq;
import com.precisely.pem.dtos.responses.ActivityInstListResp;
import com.precisely.pem.dtos.responses.ActivityInstPagnResp;
import com.precisely.pem.dtos.responses.ActivityInstResp;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.services.ActivityInstService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

public class ActivityInstanceControllerTest extends BaseControllerTest{

    @InjectMocks
    ActivityInstanceController activityInstanceController;

    @Mock
    ActivityInstService activityInstService;

    @BeforeEach
    void setup() throws Exception{
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateActivityInstDefinition() throws Exception {
        ActivityInstResp resp = new ActivityInstResp();
        ActivityInstReq req = new ActivityInstReq();

        when(activityInstService.createActivityInstance(anyString(),Mockito.any(ActivityInstReq.class)))
                .thenReturn(resp);

        ResponseEntity<Object> output = activityInstanceController.createActivityInstance(req, TEST_SPONSOR);
        assertNotNull(output);
    }

    @Test
    void testGetActivityInstanceList() throws Exception {
        ActivityInstPagnResp activityInstPagnResp = new ActivityInstPagnResp();
        List<ActivityInstListResp> list = new ArrayList<ActivityInstListResp>();

        when(activityInstService.getAllInstanceList(anyString(), anyString(), anyString(), anyString(), anyString(), anyString(),Mockito.anyBoolean(),Mockito.anyInt(),Mockito.anyInt(), anyString(), anyString()))
                .thenReturn(activityInstPagnResp);

        activityInstPagnResp.setContent(list);
        ResponseEntity<Object> output = activityInstanceController.getActivityInstanceList("test","test", InstStatus.STARTED,"test","test",false,1,1, InstanceSortBy.modifyTs, SortDirection.ASC,"cashbank");
        assertNotNull(output);
    }

    @Test
    void testGetInstanceByKey() throws ResourceNotFoundException {
        ActivityInstListResp activityInstListResp = new ActivityInstListResp();

        when(activityInstService.getInstanceByKey(anyString(), anyString())).thenReturn(activityInstListResp);

        ActivityInstListResp output = activityInstService.getInstanceByKey("sponsorContext", "activityInstKey");
        assertNotNull(output);
    }
}
