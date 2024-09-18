package com.precisely.pem.controller;

import com.precisely.pem.enums.VersionSortBy;
import com.precisely.pem.enums.SortDirection;
import com.precisely.pem.enums.Status;
import com.precisely.pem.dtos.requests.ActivityVersionReq;
import com.precisely.pem.dtos.responses.ActivityDefnVersionListResp;
import com.precisely.pem.dtos.responses.ActivityDefnVersionResp;
import com.precisely.pem.dtos.responses.ActivityVersionDefnPaginationResp;
import com.precisely.pem.dtos.responses.BaseResourceResp;
import com.precisely.pem.exceptionhandler.*;
import com.precisely.pem.services.ActivityVersionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

class ActivityVersionControllerTest extends BaseControllerTest{

    @InjectMocks
    ActivityVersionController activityVersionController;

    @Mock
    ActivityVersionService activityVersionService;

    @BeforeEach
    void setup() throws Exception{
        try(AutoCloseable mockitoAnnotations =  MockitoAnnotations.openMocks(this)){

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testGetActivityDefinitionVersionsList() throws Exception {
        ActivityVersionDefnPaginationResp resp = new ActivityVersionDefnPaginationResp();
        Mockito.when(activityVersionService.getAllVersionDefinitionList(Mockito.anyString(),Mockito.anyString(),Mockito.anyString(),Mockito.anyBoolean(),Mockito.anyInt(),Mockito.anyInt(),Mockito.anyString(),Mockito.anyString(),Mockito.any()))
                .thenReturn(resp);
        ResponseEntity<Object> output = activityVersionController.getActivityVersionDefinitionList("test",false,"test", Arrays.asList(Status.DRAFT.getStatus()),0,1, VersionSortBy.modifyTs, SortDirection.ASC,"cashbank");
        assertNotNull(output);
    }

    @Test
    void testGetActivityDefinitionVersionById() throws Exception {
        ActivityDefnVersionListResp resp = new ActivityDefnVersionListResp();
        Mockito.when(activityVersionService.getVersionDefinitionByKey(Mockito.anyString(),Mockito.anyString(),Mockito.anyString()))
                .thenReturn(resp);
        ResponseEntity<Object> output = activityVersionController.getActivityVersionDefinitionById("test","test","test");
        assertNotNull(output);
    }

    @Test
    void testPostCreateActivityDefnVersion() throws SQLException, IOException, OnlyOneDraftVersionException, ResourceNotFoundException, AlreadyDeletedException, BpmnConverterException, SchemaValidationException, XMLStreamException {
        MultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "This is a test file.".getBytes());
        ActivityDefnVersionResp resp = new ActivityDefnVersionResp();
        Mockito.when(activityVersionService.createActivityDefnVersion(Mockito.anyString(),Mockito.anyString(),Mockito.any(ActivityVersionReq.class)))
                .thenReturn(resp);
        ActivityVersionReq activityVersionReq = new ActivityVersionReq();
        ResponseEntity<Object> output = activityVersionController.createActivityDefinitionVersion("test","test",activityVersionReq);
        assertNotNull(output);
    }

    @Test
    void updateMarkAsFinal() throws Exception {
        Mockito.when(activityVersionService.markAsFinalActivityDefinitionVersion(ArgumentMatchers.anyString()))
                .thenReturn(BaseResourceResp.builder().status(Status.FINAL.getStatus()).build());

        ResponseEntity<Object> resp = activityVersionController.markActivityDefinitionStatusAsFinal(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY,TEST_ACTIVITY_DEFN_VERSION_KEY);
        assertNotNull(resp);
        assertEquals(resp.getStatusCode(), HttpStatus.OK);
    }

    @Test
    void testUpdateMarkAsFinalIfActivityVersionNotFound() throws Exception {
        Mockito.when(activityVersionService.markAsFinalActivityDefinitionVersion(ArgumentMatchers.anyString()))
                .thenThrow(new Exception(ACTIVITY_DEFINITION_VERSION_NOT_FOUND));

        Exception exception = assertThrows(Exception.class, () -> activityVersionController.markActivityDefinitionStatusAsFinal(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY,TEST_ACTIVITY_DEFN_VERSION_KEY));
        assertEquals(exception.getMessage(),ACTIVITY_DEFINITION_VERSION_NOT_FOUND);
    }
}