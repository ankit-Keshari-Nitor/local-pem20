package com.precisely.pem.services;


import com.precisely.pem.enums.Application;
import com.precisely.pem.enums.Status;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.requests.ActivityVersionReq;
import com.precisely.pem.dtos.requests.UpdateActivityVersionReq;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.shared.ActivityDefnDataDto;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.exceptionhandler.*;
import com.precisely.pem.models.ActivityDefn;
import com.precisely.pem.models.ActivityDefnData;
import com.precisely.pem.models.ActivityDefnVersion;
import com.precisely.pem.repositories.ActivityDefinitionVersionCustomRepo;
import com.precisely.pem.service.PEMActivitiService;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.Process;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.*;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.stream.XMLStreamException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ActivityVersionServiceImplTest extends BaseServiceTest{

    @InjectMocks
    ActivityVersionServiceImpl activityVersionService;
    @Mock
    private Blob mockBlob;
    @Mock
    PEMActivitiService pemActivitiService;
    @Mock
    private ActivityDefinitionVersionCustomRepo activityDefinitionVersionCustomRepo;

    @Mock
    BpmnModel bpmnModel;

    @BeforeEach
    public void setup(){
        MockitoAnnotations.openMocks(this);
        TenantContext.setTenantContext(SponsorInfo.builder().sponsorKey("TEST_SPONSOR").build());
    }

    @Test
    void testGetAllVersionDefinitionList() throws Exception {
        // Arrange
        String sponsorContext = "sponsorContext";
        String activityDefnKey = "activityDefnKey";
        String description = "description";
        Boolean isDefault = false;
        int pageNo = 0;
        int pageSize = 10;
        String sortBy = "modifyTs";
        String sortDir = "DESC";
        List<String> status = Arrays.asList(Status.DRAFT.getStatus());
        List<ActivityDefnVersion> activityDefnVersionList = new ArrayList<>();
        activityDefnVersionList.add(new ActivityDefnVersion());
        Page<ActivityDefnVersion> defnsPage = new PageImpl<>(activityDefnVersionList, PageRequest.of(pageNo, pageSize, Sort.by(sortBy).descending()), 1);
        when(activityDefinitionVersionCustomRepo.getAllVersionsList(anyString(),anyList(),anyString(),anyBoolean(),anyString(),any(Pageable.class)))
                .thenReturn(defnsPage);
        // Act
        ActivityVersionDefnPaginationResp response = activityVersionService.getAllVersionDefinitionList(
                sponsorContext, activityDefnKey, description, isDefault, pageNo, pageSize, sortBy, sortDir, Arrays.asList(Status.DRAFT.getStatus()));
        // Assert
        assertNotNull(response);
        assertEquals(1, response.getPage().getTotalElements());
    }

    private ActivityDefnVersion getVersion() {
        ActivityDefnVersion v1 = new ActivityDefnVersion();
        v1.setVersion(1.0);
        v1.setStatus("DRAFT");
        v1.setIsEncrypted(false);
        v1.setIsDefault(false);
        v1.setVaultKey("123");
        return v1;
    }

    @Test
    void testGetAllVersionDefinitionById() throws Exception {
        when(activityDefnVersionRepo.findByActivityDefnKeyAndActivityDefnVersionKeyAndActivityDefnSponsorKey(anyString(), anyString(), anyString()))
                .thenReturn(getVersion());
        ActivityDefnVersionListResp dto = activityVersionService.getVersionDefinitionByKey("test", "test", "test");
        assertNotNull(dto);
    }

    @Test
    void testPostCreateActivityDefnVersion() throws SQLException, IOException, OnlyOneDraftVersionException, ResourceNotFoundException, AlreadyDeletedException, BpmnConverterException, SchemaValidationException, XMLStreamException {
        ActivityDefnServiceImplTest activityDefnServiceImplTest = new ActivityDefnServiceImplTest();

        Optional<ActivityDefn> activityDefn = Optional.ofNullable(activityDefnServiceImplTest.getVchActivityDefnObj());
        ActivityDefnVersion activityDefnVersion = activityDefnServiceImplTest.getVCHActivityDefnVersionObj();
        ActivityDefnData activityDefnData = activityDefnServiceImplTest.getVchActivityDefnDataObj();
        activityDefn.get().setVersions(Arrays.asList(activityDefnVersion));

        when(mapper.map(any(ActivityDefnDataDto.class), eq(ActivityDefnData.class))).thenReturn(activityDefnData);

        activityDefnData.setActivityDefnVersion(activityDefnVersion);
        activityDefnVersion.setActivityDefnData(activityDefnData);

        when(activityDefnRepo.findByActivityDefnKey(anyString())).thenReturn(activityDefn.get());
        when(activityDefnDataRepo.save(any())).thenReturn(activityDefnData);
        when(activityDefnVersionRepo.save(any())).thenReturn(activityDefnVersion);

        MultipartFile file = new MockMultipartFile(TEST_FILE_KEY, TEST_FILE_VALUE, CONTENT_TYPE_TEXT, TEST_FILE_DATA.getBytes());
        Blob blob = mock(Blob.class);
        Mockito.when(bpmnConvertService.getBpmnConvertedBlob(file.getInputStream(), BpmnConverterRequest.builder().processId(TEST_BPMN_PROCESS_ID).build())).thenReturn(blob);

        ActivityVersionReq activityVersionReq = new ActivityVersionReq();
        activityVersionReq.setIsEncrypted(true);
        activityVersionReq.setFile(file);
        activityVersionReq.setApplication(Application.PEM);

        ActivityDefnVersionResp resp = activityVersionService.createActivityDefnVersion("cashbank", "test1", activityVersionReq);
        assertNotNull(resp);
        assertEquals(activityDefnVersion.getActivityDefnVersionKey(), resp.getActivityDefnVersionKey());
    }

    @Test
    public void testMarkAsFinalActivityDefinitionVersion_Success() throws Exception {

        byte[] mockData = getInputSampleFile().getBytes();
        when(mockBlob.length()).thenReturn((long) mockData.length);
        when(mockBlob.getBytes(1, (int) mockBlob.length())).thenReturn(mockData);

        String activityDefnVersionKey = "testKey";
        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setStatus("DRAFT");
        activityDefnVersion.setIsDefault(true);
        Object[] dto = {"val1", "val2", "val3", "val4", "val5", "val6", 1.0, mockBlob};
        List<Object[]> dtoList = new ArrayList<>();
        dtoList.add(dto);
        when(activityDefnVersionRepo.findById(activityDefnVersionKey)).thenReturn(Optional.of(activityDefnVersion));
        when(activityDefnVersionRepo.save(any(ActivityDefnVersion.class))).thenReturn(activityDefnVersion);
        when(activityDefnDeploymentCustomRepo.findActivitiesByActivityDefnVersionKey(activityDefnVersionKey)).thenReturn(dtoList);
        when(mapper.map(any(ActivityDefnVersion.class), eq(BaseResourceResp.class)))
                .thenReturn(new BaseResourceResp());
        when(pemActivitiService.deployProcessDefinition(anyString(),any())).thenReturn("anyKey");
        BaseResourceResp response = activityVersionService.markAsFinalActivityDefinitionVersion(activityDefnVersionKey);
        assertNotNull(response);
        assertEquals(Status.FINAL.getStatus(), activityDefnVersion.getStatus());
        verify(activityDefnVersionRepo, times(1)).save(activityDefnVersion);
        verify(activityDefnVersionRepo, times(1)).findById(activityDefnVersionKey);
    }

    @Test
    void testUpdateMarkAsFinalIfActivityVersionNotFound(){
        Optional<ActivityDefnVersion> activityDefnVersion = Optional.empty();
        mockActivityDefnVersionFindById().thenReturn(activityDefnVersion);
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> activityVersionService.
                markAsFinalActivityDefinitionVersion(TEST_ACTIVITY_DEFN_VERSION_KEY));
        assertEquals(exception.getMessage(),ACTIVITY_DEFINITION_VERSION_NOT_FOUND);
    }

    @Test
    void testUpdateMarkAsFinalIfActivityVersion_AlreadyFinal(){
        ActivityDefnVersion activityDefnVersion = getVCHActivityDefnVersionObj();

        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> activityVersionService.
                markAsFinalActivityDefinitionVersion(TEST_ACTIVITY_DEFN_VERSION_KEY));
        assertEquals(exception.getMessage(), ACTIVITY_DEFINITION_VERSION_IS_IN_FINAL_DELETE_STATUS);
    }

    @Test
    void testUpdateMarkAsFinalIfActivityVersion_Deleted(){
        ActivityDefnVersion activityDefnVersion = getDeletedVCHActivityDefnVersionObj();

        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> activityVersionService.
                markAsFinalActivityDefinitionVersion(TEST_ACTIVITY_DEFN_VERSION_KEY));
        assertEquals(exception.getMessage(),ACTIVITY_DEFINITION_VERSION_IS_IN_FINAL_DELETE_STATUS);
    }

    @Test
    void updateActivityDefinitionVersion() throws Exception {
        ActivityDefnVersion activityDefnVersion = getDraftVCHActivityDefnVersionObj();
        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));
        mockActivityDefnVersionSave(activityDefnVersion).thenReturn(activityDefnVersion);

        ActivityDefnData activityDefnData = getVchActivityDefnDataObj();
        mockActivityDefnDataFindById().thenReturn(Optional.of(activityDefnData));

        mockActivityDefnDataSave(activityDefnData).thenReturn(activityDefnData);

        MultipartFile file = getMultipartFile();
        Blob blob = mock(Blob.class);
        Mockito.when(bpmnConvertService.getBpmnConvertedBlob(file.getInputStream(),BpmnConverterRequest.builder().processId(TEST_BPMN_PROCESS_ID).build())).thenReturn(blob);

        MessageResp resp = activityVersionService.
                updateActivityDefnVersion(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY,TEST_ACTIVITY_DEFN_VERSION_KEY,
                        UpdateActivityVersionReq.builder().description(TEST_DESCRIPTION).file(file).isEncrypted(Boolean.TRUE).build());

        assertNotNull(resp);
        assertEquals(ACTIVITY_DEFINITION_VERSION_UPDATED,resp.getResponse());

    }

    @Test
    void updateActivityDefinitionVersion_PartialRequest() throws Exception {
        ActivityDefnVersion activityDefnVersion = getDraftVCHActivityDefnVersionObj();
        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));
        mockActivityDefnVersionSave(activityDefnVersion).thenReturn(activityDefnVersion);

        ActivityDefnData activityDefnData = getVchActivityDefnDataObj();
        mockActivityDefnDataFindById().thenReturn(Optional.of(activityDefnData));

        mockActivityDefnDataSave(activityDefnData).thenReturn(activityDefnData);

        MultipartFile file = getMultipartFile();
        Blob blob = mock(Blob.class);
        Mockito.when(bpmnConvertService.getBpmnConvertedBlob(file.getInputStream(),BpmnConverterRequest.builder().processId(TEST_BPMN_PROCESS_ID).build())).thenReturn(blob);

        MessageResp resp = activityVersionService.
                updateActivityDefnVersion(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY,TEST_ACTIVITY_DEFN_VERSION_KEY,
                        UpdateActivityVersionReq.builder().file(file).build());

        assertNotNull(resp);
        assertEquals(ACTIVITY_DEFINITION_VERSION_UPDATED,resp.getResponse());

    }

    @Test
    void updateActivityDefinitionVersion_ActivityDefnVersionNotFound() throws Exception {

        MultipartFile multipartFile = getMultipartFile();

        Optional<ActivityDefnVersion> activityDefnVersion = Optional.empty();
        mockActivityDefnVersionFindById().thenReturn(activityDefnVersion);

        Exception exception = assertThrows(Exception.class, () ->{
            activityVersionService.
                    updateActivityDefnVersion(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY,TEST_ACTIVITY_DEFN_VERSION_KEY,
                            UpdateActivityVersionReq.builder().description(TEST_DESCRIPTION).file(multipartFile).isEncrypted(Boolean.TRUE).build());
        });
        assertEquals(ACTIVITY_DEFINITION_VERSION_NOT_FOUND,exception.getMessage());

    }


    @Test
    void updateActivityDefinitionVersion_ActivityDefnDataNotFound() throws Exception {

        MultipartFile multipartFile = getMultipartFile();

        ActivityDefnVersion activityDefnVersion = getDraftVCHActivityDefnVersionObj();
        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));


        Exception exception = assertThrows(Exception.class, () ->{
            activityVersionService.
                    updateActivityDefnVersion(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY,TEST_ACTIVITY_DEFN_VERSION_KEY,
                            UpdateActivityVersionReq.builder().description(TEST_DESCRIPTION).file(multipartFile).isEncrypted(Boolean.TRUE).build());
        });
        assertEquals(ACTIVITY_DEFINITION_VERSION_DATA_NOT_FOUND,exception.getMessage());

    }

    @Test
    void updateActivityDefinitionVersion_EmtpyRequest() throws Exception {

        ActivityDefnVersion activityDefnVersion = getDraftVCHActivityDefnVersionObj();
        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));

        Exception exception = assertThrows(Exception.class, () -> activityVersionService.
                updateActivityDefnVersion(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY,TEST_ACTIVITY_DEFN_VERSION_KEY,
                        UpdateActivityVersionReq.builder().build()));
        assertEquals(exception.getMessage(), ACTIVITY_DEFINITION_VERSION_REQUIRED_SINGLE_FIELD_TO_UPDATE);

    }

    @Test
    void getActivityDataForSpecificVersion_Positive() throws Exception{

        byte[] mockData = getInputSampleFile().getBytes();
        when(mockBlob.length()).thenReturn((long) mockData.length);
        when(mockBlob.getBytes(1, (int) mockBlob.length())).thenReturn(mockData);
        when(mockBlob.getBinaryStream()).thenReturn(new ByteArrayInputStream(mockData));

        ActivityDefnVersion activityDefnVersion = getDraftVCHActivityDefnVersionObj();
        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));

        ActivityDefnData activityDefnData = getVchActivityDefnDataObj();
        activityDefnData.setDefData(mockBlob);
        mockActivityDefnDataFindById().thenReturn(Optional.of(activityDefnData));

        InputStreamResource emptyResource = new InputStreamResource(mockBlob.getBinaryStream());
        Mockito.when(bpmnConvertService.getPemBpmnJsonData(activityDefnData.getDefData())).thenReturn(emptyResource);

        ActivityDataResponse activityDataResponse = activityVersionService
                .getActivityDataForSpecificVersion(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY,TEST_ACTIVITY_DEFN_VERSION_KEY);
        assertNotNull(activityDataResponse);
        assertNotNull(activityDataResponse.getStreamResource());
    }

    @Test
    void getActivityDataForSpecificVersion_Version_NotFound(){
        mockActivityDefnVersionFindById().thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () ->{
            activityVersionService
                    .getActivityDataForSpecificVersion(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY,TEST_ACTIVITY_DEFN_VERSION_KEY);
        });
        assertEquals(ACTIVITY_DEFINITION_VERSION_NOT_FOUND,exception.getMessage());
    }

    @Test
    void getActivityDataForSpecificVersion_VersionData_NotFound(){
        ActivityDefnVersion activityDefnVersion = getDraftVCHActivityDefnVersionObj();
        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));

        mockActivityDefnDataFindById().thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () ->{
            activityVersionService
                    .getActivityDataForSpecificVersion(TEST_SPONSOR,TEST_ACTIVITY_DEFN_KEY,TEST_ACTIVITY_DEFN_VERSION_KEY);
        });
        assertEquals(ACTIVITY_DEFINITION_VERSION_DATA_NOT_FOUND,exception.getMessage());
    }

    @Test
    void getActivityContextDataForSpecificVersion_Positive() throws Exception{
        byte[] mockData = SAMPLE_DATA.getBytes();
        when(mockBlob.length()).thenReturn((long) mockData.length);
        when(mockBlob.getBytes(1, (int) mockBlob.length())).thenReturn(mockData);

        ActivityDefnVersion activityDefnVersion = getDraftVCHActivityDefnVersionObj();
        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));

        ActivityDefnData activityDefnData = getVchActivityDefnDataObj();
        activityDefnData.setDefData(mockBlob);
        mockActivityDefnDataFindById().thenReturn(Optional.of(activityDefnData));

        Mockito.when(bpmnModel.getProcessById(ArgumentMatchers.anyString())).thenReturn(new Process());
        Mockito.when(bpmnConvertService.getBpmnModel(activityDefnData.getDefData())).thenReturn(bpmnModel);
        Mockito.when(bpmnConvertService.getContextDataFromProcess(ArgumentMatchers.any())).thenReturn(TEST_CONTEXT_DATA);
        Object response = activityVersionService.getActivityDefinitionContextData(TEST_ACTIVITY_DEFN_VERSION_KEY);
        assertNotNull(response);
    }

    @Test
    void getActivityContextDataForSpecificVersion_Version_NotFound(){
        mockActivityDefnVersionFindById().thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> activityVersionService
                .getActivityDefinitionContextData(TEST_ACTIVITY_DEFN_VERSION_KEY));
        assertEquals(ACTIVITY_DEFINITION_VERSION_NOT_FOUND,exception.getMessage());
    }

    @Test
    void getActivityContextDataForSpecificVersion_VersionData_NotFound(){
        ActivityDefnVersion activityDefnVersion = getDraftVCHActivityDefnVersionObj();
        mockActivityDefnVersionFindById().thenReturn(Optional.of(activityDefnVersion));

        mockActivityDefnDataFindById().thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> activityVersionService
                .getActivityDefinitionContextData(TEST_ACTIVITY_DEFN_VERSION_KEY));
        assertEquals(ACTIVITY_DEFINITION_VERSION_DATA_NOT_FOUND,exception.getMessage());
    }

}
