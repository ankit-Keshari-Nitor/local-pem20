package com.precisely.pem.services;

import com.precisely.pem.enums.Application;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.requests.ActivityDefnReq;
import com.precisely.pem.dtos.requests.UpdateActivityReq;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.exceptionhandler.BpmnConverterException;
import com.precisely.pem.exceptionhandler.DuplicateEntryException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.exceptionhandler.SchemaValidationException;
import com.precisely.pem.models.ActivityDefn;
import com.precisely.pem.models.ActivityDefnVersion;
import com.precisely.pem.repositories.ActivityDefnCustomRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.domain.*;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;


class ActivityDefnServiceImplTest extends BaseServiceTest {

    @InjectMocks
    protected ActivityDefnServiceImpl activityDefinitionService;

    @Mock
    private ActivityDefnCustomRepo activityDefnCustomRepo;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        TenantContext.setTenantContext(SponsorInfo.builder().sponsorKey(TEST_SPONSOR).build());
    }

    @Test
    void testGetAllDefinitionList() throws Exception {
        // Given
        String sponsorContext = "testContext";
        String name = "testName";
        String description = "testDescription";
        String application = "testApplication";
        List<String> status = Arrays.asList("DRAFT");
        int pageNo = 0;
        int pageSize = 10;
        String sortBy = "modifyTs";
        String sortDir = "DESC";

        Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(Sort.Direction.DESC, sortBy));
        SponsorInfo sponsorInfo = new SponsorInfo(); // Assuming this is a POJO
        sponsorInfo.setSponsorKey("testSponsorKey");

        ActivityDefn activityDefn = new ActivityDefn(); // Assuming this is a POJO
        ActivityDefnVersion version = new ActivityDefnVersion(); // Assuming this is a POJO
        version.setIsDefault(true);
        List<ActivityDefnVersion> versionList = Collections.singletonList(version);
        activityDefn.setVersions(versionList);
        List<ActivityDefn> activityDefnList = Collections.singletonList(activityDefn);
        Page<ActivityDefn> defnsPage = new PageImpl<>(activityDefnList, pageable, 1);

        ActivityDefnListResp resp = new ActivityDefnListResp();
        resp.setActivityDefnKey("testKey");
        resp.setApplication(Application.PEM.getApp());
        List<ActivityDefnListResp> defnContent = new ArrayList<>();
        defnContent.add(resp);
        ActivityDefnPaginationRes activityDefnPaginationRes = new ActivityDefnPaginationRes();
        activityDefnPaginationRes.setContent(defnContent);

        when(activityDefnCustomRepo.getActivityDefnsPage(name, description, status, application, sponsorInfo.getSponsorKey(), pageable))
                .thenReturn(defnsPage);

        ActivityDefnVersionListResp activityDefnVersionResp = new ActivityDefnVersionListResp(); // Assuming this is a POJO
        when(mapper.map(version, ActivityDefnVersionListResp.class)).thenReturn(activityDefnVersionResp);

        ActivityDefnListResp activityDefnListResp = new ActivityDefnListResp(); // Assuming this is a POJO
        when(mapper.map(activityDefn, ActivityDefnListResp.class)).thenReturn(activityDefnListResp);

        // When
        ActivityDefnPaginationRes response = activityDefinitionService.getAllDefinitionList(sponsorContext, name, description, application, status, pageNo, pageSize, sortBy, sortDir);

        // Then
        assertNotNull(response);
    }


    @Test
    void testCreateActivityDefinition() throws SQLException, IOException, DuplicateEntryException, ResourceNotFoundException, BpmnConverterException, SchemaValidationException, XMLStreamException {
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        when(activityDefnRepo.save(Mockito.any())).thenReturn(getVchActivityDefnObj());
        when(activityDefnDataRepo.save(Mockito.any())).thenReturn(getVchActivityDefnDataObj());
        when(activityDefnVersionRepo.save(Mockito.any())).thenReturn(getVCHActivityDefnVersionObj());
        MultipartFile file = new MockMultipartFile(TEST_FILE_KEY, TEST_FILE_VALUE, CONTENT_TYPE_TEXT, TEST_FILE_DATA.getBytes());
        Blob blob = mock(Blob.class);
        when(bpmnConvertService.getBpmnConvertedBlob(file.getInputStream(), BpmnConverterRequest.builder().processId(TEST_BPMN_PROCESS_ID).build())).thenReturn(blob);

        ActivityDefnReq activityDefnReq = new ActivityDefnReq();
        activityDefnReq.setApplication(Application.PEM);
        activityDefnReq.setDescription(TEST_DESCRIPTION);
        activityDefnReq.setName(TEST_NAME);
        activityDefnReq.setFile(file);

        assertNotNull(activityDefinitionService.createActivityDefinition(TEST_SPONSOR, activityDefnReq));
    }

    @Test
    void testFindByActivityDefnKeyAndSponsorKey() throws Exception {
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        mockActivityDefnKeyAndSoponsorKey().thenReturn(getVchActivityDefnObj());
        ActivityDefnListResp resp;
        resp = activityDefinitionService.getActivityDefinitionByKey(TEST_SPONSOR, TEST_ACTIVITY_DEFN_KEY);
        assertNotNull(resp);
    }

    @Test
    void updateActivityDefinition_NotFoundActivityDefinition() throws Exception {
        mockActivityDefnKey().thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> activityDefinitionService.updateActivityDefinitionByKey(TEST_SPONSOR, TEST_ACTIVITY_DEFN_KEY, UpdateActivityReq.builder().name(TEST_NAME).description(TEST_DESCRIPTION).build()));
        assertEquals(exception.getMessage(), ACTIVITY_DEFINITION_NOT_FOUND);
    }

    @Test
    void updateActivityDefinition_AlreadyDeletedActivityDefinition() throws Exception {
        mockActivityDefnKey().thenReturn(Optional.ofNullable(getDeletedVchActivityDefnObj()));

        Exception exception = assertThrows(Exception.class, () -> activityDefinitionService.updateActivityDefinitionByKey(TEST_SPONSOR, TEST_ACTIVITY_DEFN_KEY, UpdateActivityReq.builder().name(TEST_NAME).description(TEST_DESCRIPTION).build()));
        assertEquals(exception.getMessage(), ACTIVITY_DEFN_KEY_WHICH_IS_ALREADY_IN_DELETED_STATE);
    }

    @Test
    void updateActivityDefinition_Positive() throws Exception {
        mockActivityDefnKey().thenReturn(Optional.ofNullable(getVchActivityDefnObj()));

        MessageResp resp = activityDefinitionService.updateActivityDefinitionByKey(TEST_SPONSOR, TEST_KEY, UpdateActivityReq.builder().name(TEST_NAME).description(TEST_DESCRIPTION).build());
        assertNotNull(resp);
    }

    @Test
    void deleteActivityDefinition_WithAllDraftVersions() throws Exception {
        mockActivityDefnKeyAndSoponsorKey().thenReturn(getVchActivityDefnObj());

        mockFindByActivityDefnKey().thenReturn(getAllDraftVersionList());

        MessageResp response = activityDefinitionService.deleteActivityDefinitionByKey(TEST_SPONSOR, TEST_KEY);
        assertNotNull(response);
    }

    @Test
    void deleteActivityDefinition_WithPartialDraftVersions() throws Exception {
        mockActivityDefnKeyAndSoponsorKey().thenReturn(getVchActivityDefnObj());

        mockFindByActivityDefnKey().thenReturn(getPartialDraftVersionList());

        MessageResp response = activityDefinitionService.deleteActivityDefinitionByKey(TEST_SPONSOR, TEST_KEY);
        assertNotNull(response);
    }

    @Test
    void deleteActivityDefinition_NotFoundActivityDefinition() throws Exception {
        mockActivityDefnKeyAndSoponsorKey().thenReturn(null);

        Exception exception = assertThrows(Exception.class, () -> activityDefinitionService.deleteActivityDefinitionByKey(TEST_SPONSOR, TEST_ACTIVITY_DEFN_KEY));
        assertEquals(exception.getMessage(), ACTIVITY_DEFINITION_NOT_FOUND);
    }

    @Test
    void deleteActivityDefinition_AlreadyDeletedActivityDefinition() {
        mockActivityDefnKeyAndSoponsorKey().thenReturn(getDeletedVchActivityDefnObj());

        Exception exception = assertThrows(Exception.class, () -> activityDefinitionService.deleteActivityDefinitionByKey(TEST_SPONSOR, TEST_ACTIVITY_DEFN_KEY));
        assertEquals(exception.getMessage(), ACTIVITY_DEFINITION_ALREADY_DELETED);
    }

}