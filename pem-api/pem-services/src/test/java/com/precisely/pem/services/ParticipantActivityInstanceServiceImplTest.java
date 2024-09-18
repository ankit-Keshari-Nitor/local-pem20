package com.precisely.pem.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.precisely.pem.commonUtil.ApplicationConstants;
import com.precisely.pem.dtos.requests.ProcessDataEvaluation;
import com.precisely.pem.dtos.requests.SetOwnerRequest;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.shared.ActivityTaskDto;
import com.precisely.pem.dtos.shared.PcptActivityInstDto;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.dtos.task.TaskDTO;
import com.precisely.pem.enums.SortDirection;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.models.*;
import com.precisely.pem.repositories.ActivityProcDefRepo;
import com.precisely.pem.service.PEMActivitiService;
import junit.framework.Assert;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.sql.rowset.serial.SerialBlob;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Blob;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class ParticipantActivityInstanceServiceImplTest extends BaseServiceTest{

    @InjectMocks
    protected ParticipantActivityInstServiceImpl participantActivityInstServiceImpl;
    @Mock
    private ActivityProcDefRepo activityProcDefRepo;
    @Mock
    private Blob mockBlob;
    @Mock
    private PEMActivitiService pemActivitiService;
    @BeforeEach
    public void setup(){
        MockitoAnnotations.openMocks(this);
        TenantContext.setTenantContext(SponsorInfo.builder().sponsorKey(TEST_SPONSOR).build());
    }

    @Test
    public void testGetPcptActivityInstanceOnScheduleList() throws Exception {
        Page<PcptActivityInst> page = new PageImpl<>(getListOfPcptActivityInstanceDefnObj());
        String TEST_CURRENT_DATE = LocalDateTime.now().toString();
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        when(pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndPartnerNameAndOnScheduleProgress(
                eq(TEST_SPONSOR), eq(TEST_ACTIVITY_INSTANCE_KEY), eq(TEST_STATUS), eq(TEST_CURRENT_TASK_NAME), eq(TEST_PARTNER_NAME),eq(TEST_CURRENT_DATE),
                Mockito.any(Pageable.class))).thenReturn(page);
        PcptActivityInstDto dtoObj = new PcptActivityInstDto();
        when(mapper.map(Mockito.any(PcptActivityInst.class), eq(PcptActivityInstDto.class))).thenReturn(dtoObj);

    }

    @Test
    public void testGetPcptActivityInstanceDelayedList() throws Exception {
        Page<PcptActivityInst> page = new PageImpl<>(getListOfPcptActivityInstanceDefnObj());
        String TEST_CURRENT_DATE = LocalDateTime.of(2024,5,20,0,0).toString();
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        when(pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndPartnerNameAndDelayedProgress(
                eq(TEST_SPONSOR), eq(TEST_ACTIVITY_INSTANCE_KEY), eq(TEST_STATUS), eq(TEST_CURRENT_TASK_NAME), eq(TEST_PARTNER_NAME),eq(TEST_CURRENT_DATE),
                Mockito.any(Pageable.class))).thenReturn(page);
        PcptActivityInstDto dtoObj = new PcptActivityInstDto();
        when(mapper.map(Mockito.any(PcptActivityInst.class), eq(PcptActivityInstDto.class))).thenReturn(dtoObj);

    }


    @Test
    void testGetByPcptActivityInstanceKeyAndSponsorKey() throws Exception {
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        mockPcptActivityInstanceKeyAndSponsorKey().thenReturn(getPcptActivityInstanceDefnObj());
        ParticipantActivityInstResp resp;
        resp = participantActivityInstServiceImpl.getParticipantActivityInstanceByKey(TEST_SPONSOR,TEST_PCPT_ACTIVITY_INSTANCE_KEY);
        assertNotNull(resp);
    }

    @Test
    public void testStartActivity_Success() throws Exception {
        // Given
        String sponsorContext = "testContext";
        String pcptActivityInstKey = "testKey";

        SponsorInfo sponsorInfo = new SponsorInfo(); // Assuming this is a POJO
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptInstStatus("NOT_STARTED");
        pcptActivityInst.setActivityInstKey("activityInstKey");
        pcptActivityInst.setPcptContextData(new SerialBlob("testData".getBytes()));

        ActivityInst activityInst = new ActivityInst();
        activityInst.setActivityDefnVersionKey("activityDefnVersionKey");

        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setActivityDefnKey("activityDefnKey");

        ActivityDefn activityDefn = new ActivityDefn();
        activityDefn.setActivityName("activityName");

        when(pcptInstRepo.findByPcptActivityInstKey(pcptActivityInstKey)).thenReturn(pcptActivityInst);
        when(activityInstRepo.findByActivityInstKey("activityInstKey")).thenReturn(activityInst);
        when(activityDefnVersionRepo.findByActivityDefnVersionKey("activityDefnVersionKey")).thenReturn(activityDefnVersion);
        when(activityDefnRepo.findByActivityDefnKey("activityDefnKey")).thenReturn(activityDefn);
        when(pemActivitiService.startProcessInstanceByKey(eq("ID-activityDefnVersionKey"), any())).thenReturn("processInstanceId");

        byte[] mockData = getInputSampleFile().getBytes();
        when(mockBlob.length()).thenReturn((long) mockData.length);
        when(mockBlob.getBytes(1, (int) mockBlob.length())).thenReturn(mockData);
        when(mockBlob.getBinaryStream()).thenReturn(new ByteArrayInputStream(mockData));

        ActivityDefnData activityDefnData = getVchActivityDefnDataObj();
        activityDefnData.setDefData(mockBlob);
        Mockito.when(activityDefnDataRepo.findByActivityDefnDataKey(ArgumentMatchers.any())).thenReturn(activityDefnData);

        // When
        MessageResp response = participantActivityInstServiceImpl.startActivity(sponsorContext, pcptActivityInstKey);

        // Then
        assertNotNull(response);
        assertEquals("SUCCESS", response.getResponse());
        verify(pcptInstRepo, times(1)).save(pcptActivityInst);
    }

    @Test
    public void testStartActivity_ResourceNotFound() {
        when(pcptInstRepo.findByPcptActivityInstKey(anyString())).thenReturn(null);

        Exception exception = assertThrows(ResourceNotFoundException.class, () -> {
            participantActivityInstServiceImpl.startActivity("sponsorContext", "pcptActivityInstKey");
        });

        String expectedMessage = "The participant instance with key 'pcptActivityInstKey' not found.";
        String actualMessage = exception.getMessage();
        assertTrue(actualMessage.contains(expectedMessage));

        verify(pcptInstRepo, times(1)).findByPcptActivityInstKey(anyString());
    }

    @Test
    public void testGetTaskDetails_success() throws Exception {
        String sponsorContext = "sponsorContext";
        String pcptActivityInstKey = "pcptActivityInstKey";
        String taskKey = "taskKey";
        SponsorInfo sponsorInfo = new SponsorInfo();
        sponsorInfo.setSponsorKey("sponsorKey");
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptInstStatus("STARTED");
        TaskDTO taskDTO = new TaskDTO();
        ActivityTaskDto activityTaskDto = new ActivityTaskDto();
        when(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(anyString(), anyString())).thenReturn(pcptActivityInst);
        when(pemActivitiService.getUserNodeDetails(anyString())).thenReturn(taskDTO);
        when(mapper.map(any(TaskDTO.class), eq(ActivityTaskDto.class))).thenReturn(activityTaskDto);
        ActivityTaskDto result = participantActivityInstServiceImpl.getNodeDetails(sponsorContext, pcptActivityInstKey, taskKey);
        assertNotNull(result);
        verify(pemActivitiService, times(1)).getUserNodeDetails(taskKey);
    }

    @Test
    public void testSubmitTaskWhenPcptInstIsStartedAndNotDraft() throws Exception {
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptInstStatus("STARTED");
        String sponsorContext = "sponsorContext";
        String pcptActivityInstKey = "pcptActivityInstKey";
        String nodeKey = "nodeKey";
        String data = "{\n\"dataType\": \"String\",\n\"lhs\": \"Op3\",\n\"rhs\": \"Op4\",\n\"operator\": \"beginsWith\"\n}";
        Boolean isDraft = false;
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setFormNodeType(ApplicationConstants.CUSTOM_FORM_NODE);
        when(pemActivitiService.getUserNodeDetails(nodeKey)).thenReturn(taskDTO);
        when(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(anyString(), anyString())).thenReturn(pcptActivityInst);
        BaseResourceResp response = participantActivityInstServiceImpl.completeNode(sponsorContext, pcptActivityInstKey, nodeKey, data, isDraft);
        assertNotNull(response);
    }

    @Test
    public void testSubmitTaskWhenPcptInstIsStartedAndDraft() throws Exception {
        String sponsorContext = "sponsorContext";
        String pcptActivityInstKey = "pcptActivityInstKey";
        String nodeKey = "taskKey";
        String data = "{\n\"dataType\": \"String\",\n\"lhs\": \"Op3\",\n\"rhs\": \"Op4\",\n\"operator\": \"beginsWith\"\n}";
        Boolean isDraft = true;
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptInstStatus("STARTED");
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setFormNodeType(ApplicationConstants.CUSTOM_FORM_NODE);
        when(pemActivitiService.getUserNodeDetails(nodeKey)).thenReturn(taskDTO);
        when(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(anyString(), anyString())).thenReturn(pcptActivityInst);
        BaseResourceResp response = participantActivityInstServiceImpl.completeNode(sponsorContext, pcptActivityInstKey, nodeKey, data, isDraft);
        assertNotNull(response);
        Map<String, Object> expectedVariables = new HashMap<>();
        expectedVariables.put("draft", data);
    }

    @Test
    public void testGetNodeDetails_success() throws Exception {
        String sponsorContext = "sponsorContext";
        String pcptActivityInstKey = "pcptActivityInstKey";
        String nodeKey = "nodeKey";
        SponsorInfo sponsorInfo = new SponsorInfo();
        sponsorInfo.setSponsorKey("sponsorKey");
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptInstStatus("STARTED");
        TaskDTO taskDTO = new TaskDTO();
        ActivityTaskDto activityTaskDto = new ActivityTaskDto();
        when(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(anyString(), anyString())).thenReturn(pcptActivityInst);
        when(pemActivitiService.getUserNodeDetails(anyString())).thenReturn(taskDTO);
        when(mapper.map(any(TaskDTO.class), eq(ActivityTaskDto.class))).thenReturn(activityTaskDto);
        ActivityTaskDto result = participantActivityInstServiceImpl.getNodeDetails(sponsorContext, pcptActivityInstKey, nodeKey);
        assertNotNull(result);
    }

    @Test
    public void testSubmitNodeWhenPcptInstIsStartedAndNotDraft() throws Exception {
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptInstStatus("STARTED");
        String sponsorContext = "sponsorContext";
        String pcptActivityInstKey = "pcptActivityInstKey";
        String nodeKey = "nodeKey";
        String data = "{\n\"dataType\": \"String\",\n\"lhs\": \"Op3\",\n\"rhs\": \"Op4\",\n\"operator\": \"beginsWith\"\n}";
        Boolean isDraft = false;
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setFormNodeType(ApplicationConstants.CUSTOM_FORM_NODE);
        when(pemActivitiService.getUserNodeDetails(nodeKey)).thenReturn(taskDTO);
        when(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(anyString(), anyString())).thenReturn(pcptActivityInst);
        BaseResourceResp response = participantActivityInstServiceImpl.completeNode(sponsorContext, pcptActivityInstKey, nodeKey, data, isDraft);
        assertNotNull(response);
    }

    @Test
    public void testSubmitNodeWhenPcptInstIsStartedAndDraft() throws Exception {
        String sponsorContext = "sponsorContext";
        String pcptActivityInstKey = "pcptActivityInstKey";
        String nodeKey = "nodeKey";
        String data = "{\n\"dataType\": \"String\",\n\"lhs\": \"Op3\",\n\"rhs\": \"Op4\",\n\"operator\": \"beginsWith\"\n}";
        Boolean isDraft = true;
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setFormNodeType(ApplicationConstants.CUSTOM_FORM_NODE);
        when(pemActivitiService.getUserNodeDetails(nodeKey)).thenReturn(taskDTO);
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptInstStatus("STARTED");
        when(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(anyString(), anyString())).thenReturn(pcptActivityInst);
        BaseResourceResp response = participantActivityInstServiceImpl.completeNode(sponsorContext, pcptActivityInstKey, nodeKey, data, isDraft);
        assertNotNull(response);
    }

    @Test
    public void evaluatePath_Success() throws Exception {
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setActivityWorkflowInstKey(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY);
        when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(pcptActivityInst));

        when(pemActivitiService.getProcessVariables(ArgumentMatchers.anyString())).thenReturn(getMockedProcessVariables());

        List<String> paths = new ArrayList<>();
        paths.add("$.applications.SSP.FTP_Netmap");
        paths.add("$.applications.SSP.ciphers.cipher[*]");
        paths.add("$.applications.SponsorConfigurations.CustomProtocols.protocol[?(@._name == 'http-protocol')]");
        ProcessEvaluationResponse response = participantActivityInstServiceImpl.evaluatePaths(TEST_PCPT_ACTIVITY_INSTANCE_KEY,
                ProcessDataEvaluation
                        .builder()
                        .paths(paths)
                        .build());

        assertEquals(TEST_CONTEXT_DATA_FIELD, response.getProcessEvaluationResult().get(0).getValue());
        assertNotNull(response.getProcessEvaluationResult().get(1).getValue());
        assertNotNull(response.getProcessEvaluationResult().get(2).getValue());

    }

    @Test
    public void evaluatePath_PcptInstanceKeyNotFound_Failure() {

        when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.empty());

        List<String> paths = new ArrayList<>();
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> participantActivityInstServiceImpl.
                evaluatePaths(TEST_PCPT_ACTIVITY_INSTANCE_KEY,ProcessDataEvaluation
                        .builder()
                        .paths(paths)
                        .build()));

        assertNotNull(exception);
        assertEquals(PCPT_ACTIVITY_INSTANCE_NOT_FOUND,exception.getMessage());
    }

    @Test
    public void evaluatePath_ProcessDataNotFound_Failure() {
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setActivityWorkflowInstKey(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY);
        when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(pcptActivityInst));

        when(pemActivitiService.getProcessVariables(ArgumentMatchers.anyString())).thenReturn(null );
        List<String> paths = new ArrayList<>();
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> participantActivityInstServiceImpl.
                evaluatePaths(TEST_PCPT_ACTIVITY_INSTANCE_KEY,ProcessDataEvaluation
                        .builder()
                        .paths(paths)
                        .build()));

        assertNotNull(exception);
        assertEquals(PCPT_ACTIVITY_INSTANCE_PROCESS_DATA_NOT_FOUND,exception.getMessage());
    }

    @Test
    public void evaluatePath_PcptActivityNotStarted_Failure() {
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(pcptActivityInst));

        List<String> paths = new ArrayList<>();
        Exception exception = assertThrows(ResourceNotFoundException.class, () -> participantActivityInstServiceImpl.
                evaluatePaths(TEST_PCPT_ACTIVITY_INSTANCE_KEY,ProcessDataEvaluation
                        .builder()
                        .paths(paths)
                        .build()));

        assertNotNull(exception);
        assertEquals(PCPT_ACTIVITY_INSTANCE_NOT_STARTED,exception.getMessage());
    }

    private static Map<String, Object>  getMockedProcessVariables() throws IOException {
        ClassPathResource classPathResource = new ClassPathResource(CONTEXT_DATA_SAMPLE_JSON);
        Path filePath = Paths.get(classPathResource.getURI());
        String contextDataJson = new String(Files.readAllBytes(filePath));
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(contextDataJson, new TypeReference<HashMap<String, Object>>() {});
    }

    @Test
    public void setOwner_Success() throws ResourceNotFoundException {
        Mockito.when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(PcptActivityInst
                .builder().activityWorkflowInstKey(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY).build()));

        Map<String,Object> existingVars = new HashMap<>();
        Map<String,Object> taskVars = new HashMap<>();
        existingVars.put(TEST_KEY,taskVars);
        Mockito.when(pemActivitiService.getProcessVariables(ArgumentMatchers.anyString())).thenReturn(existingVars);

        Mockito.when(pemActivitiService.setOwnerToRunningTasks(ArgumentMatchers.anyString(),ArgumentMatchers.anyList(),ArgumentMatchers.anyList())).thenReturn(Boolean.TRUE);

        mockParticipantFindAllById(List.of(Participant.builder().participantKey(TEST_USER_KEY).participantStatus(APPROVED).isSponsorUser("y").build()));
        mockRoleFindById(List.of(Role.builder().roleKey(TEST_ROLE_KEY).build()));
        mockUserRoleFindByParticipantKeyIn(List.of(UserRole.builder().participantKey(TEST_USER_KEY).userRoleKey(TEST_ROLE_KEY).build()));

        BaseResourceResp resp = participantActivityInstServiceImpl.setOwner(TEST_SPONSOR,TEST_PCPT_ACTIVITY_INSTANCE_KEY,TEST_KEY,
                SetOwnerRequest.builder().userKey(TEST_USER_KEY).roleKey(TEST_ROLE_KEY).build());

        Assert.assertNotNull(resp);
        Assert.assertNotNull(resp.getStatus());
        Assert.assertEquals(resp.getStatus(),"Success");
    }

    @Test
    public void setOwner_TaskKey_Failure() {
        Mockito.when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(PcptActivityInst
                .builder().activityWorkflowInstKey(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY).build()));
        Mockito.when(pemActivitiService.setOwnerToRunningTasks(ArgumentMatchers.anyString(),ArgumentMatchers.anyList(),ArgumentMatchers.anyList())).thenReturn(Boolean.TRUE);
        mockParticipantFindAllById(List.of(Participant.builder().participantKey(TEST_USER_KEY).participantStatus(APPROVED).isSponsorUser("y").build()));
        mockRoleFindById(List.of(Role.builder().roleKey(TEST_ROLE_KEY).build()));
        mockUserRoleFindByParticipantKeyIn(List.of(UserRole.builder().participantKey(TEST_USER_KEY).userRoleKey(TEST_ROLE_KEY).build()));

        Map<String,Object> existingVars = new HashMap<>();
        Map<String,Object> taskVars = new HashMap<>();
        existingVars.put(TEST_KEY+"ABC",taskVars);
        Mockito.when(pemActivitiService.getProcessVariables(ArgumentMatchers.anyString())).thenReturn(existingVars);

        Exception exception = assertThrows(ResourceNotFoundException.class, () -> participantActivityInstServiceImpl.setOwner(TEST_SPONSOR,TEST_PCPT_ACTIVITY_INSTANCE_KEY,TEST_KEY,
                SetOwnerRequest.builder().userKey(TEST_USER_KEY).roleKey(TEST_ROLE_KEY).build()));

        Assert.assertNotNull(exception);
        Assert.assertEquals(TASK_KEY_NOT_FOUND_ERROR,exception.getMessage());
    }

    @Test
    public void setOwner_PcptActivityInstKey_Failure() {
        Mockito.when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.empty());

        Exception exception = assertThrows(ResourceNotFoundException.class, () -> participantActivityInstServiceImpl.setOwner(TEST_SPONSOR,TEST_PCPT_ACTIVITY_INSTANCE_KEY,TEST_KEY,
                SetOwnerRequest.builder().userKey(TEST_USER_KEY).roleKey(TEST_ROLE_KEY).build()));

        Assert.assertNotNull(exception);
        Assert.assertEquals(PCPT_ACTIVITY_INSTANCE_NOT_FOUND,exception.getMessage());
    }

    @Test
    public void setOwner_ActivityWorkflowInstKey_Failure() {
        Mockito.when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(PcptActivityInst
                .builder().build()));

        Exception exception = assertThrows(ResourceNotFoundException.class, () -> participantActivityInstServiceImpl.setOwner(TEST_SPONSOR,TEST_PCPT_ACTIVITY_INSTANCE_KEY,TEST_KEY,
                SetOwnerRequest.builder().userKey(TEST_USER_KEY).roleKey(TEST_ROLE_KEY).build()));

        Assert.assertNotNull(exception);
        Assert.assertEquals(PCPT_ACTIVITY_INSTANCE_NOT_STARTED,exception.getMessage());
    }

    @Test
    public void setOwner_UserKeyNotFound_Failure() {
        Mockito.when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(PcptActivityInst
                .builder().activityWorkflowInstKey(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY).build()));
        Mockito.when(pemActivitiService.setOwnerToRunningTasks(ArgumentMatchers.anyString(),ArgumentMatchers.anyList(),ArgumentMatchers.anyList())).thenReturn(Boolean.TRUE);
        Map<String,Object> existingVars = new HashMap<>();
        Map<String,Object> taskVars = new HashMap<>();
        existingVars.put(TEST_KEY,taskVars);
        Mockito.when(pemActivitiService.getProcessVariables(ArgumentMatchers.anyString())).thenReturn(existingVars);

        Exception exception = assertThrows(ResourceNotFoundException.class, () -> participantActivityInstServiceImpl.setOwner(TEST_SPONSOR,TEST_PCPT_ACTIVITY_INSTANCE_KEY,TEST_KEY,
                SetOwnerRequest.builder().userKey(TEST_USER_KEY).roleKey(TEST_ROLE_KEY).build()));

        Assert.assertNotNull(exception);
        Assert.assertEquals(USER_KEY_NOT_FOUND+TEST_USER_KEY,exception.getMessage());
    }

    @Test
    public void setOwner_UserNotApproved_Failure() {
        Mockito.when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(PcptActivityInst
                .builder().activityWorkflowInstKey(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY).build()));
        Mockito.when(pemActivitiService.setOwnerToRunningTasks(ArgumentMatchers.anyString(),ArgumentMatchers.anyList(),ArgumentMatchers.anyList())).thenReturn(Boolean.TRUE);
        mockParticipantFindAllById(List.of(Participant.builder().participantKey(TEST_USER_KEY).participantStatus(APPROVED+"ABC").isSponsorUser("y").build()));

        Map<String,Object> existingVars = new HashMap<>();
        Map<String,Object> taskVars = new HashMap<>();
        existingVars.put(TEST_KEY,taskVars);
        Mockito.when(pemActivitiService.getProcessVariables(ArgumentMatchers.anyString())).thenReturn(existingVars);

        Exception exception = assertThrows(ResourceNotFoundException.class, () -> participantActivityInstServiceImpl.setOwner(TEST_SPONSOR,TEST_PCPT_ACTIVITY_INSTANCE_KEY,TEST_KEY,
                SetOwnerRequest.builder().userKey(TEST_USER_KEY).roleKey(TEST_ROLE_KEY).build()));

        Assert.assertNotNull(exception);
        Assert.assertEquals(USER_NOT_APPROVED+TEST_USER_KEY,exception.getMessage());
    }

    @Test
    public void setOwner_UserNotAssignedRole_Failure() {
        Mockito.when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(PcptActivityInst
                .builder().activityWorkflowInstKey(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY).build()));
        Mockito.when(pemActivitiService.setOwnerToRunningTasks(ArgumentMatchers.anyString(),ArgumentMatchers.anyList(),ArgumentMatchers.anyList())).thenReturn(Boolean.TRUE);
        mockParticipantFindAllById(List.of(Participant.builder().participantKey(TEST_USER_KEY).participantStatus(APPROVED).isSponsorUser("y").build()));

        Map<String,Object> existingVars = new HashMap<>();
        Map<String,Object> taskVars = new HashMap<>();
        existingVars.put(TEST_KEY,taskVars);
        Mockito.when(pemActivitiService.getProcessVariables(ArgumentMatchers.anyString())).thenReturn(existingVars);

        Exception exception = assertThrows(ResourceNotFoundException.class, () -> participantActivityInstServiceImpl.setOwner(TEST_SPONSOR,TEST_PCPT_ACTIVITY_INSTANCE_KEY,TEST_KEY,
                SetOwnerRequest.builder().userKey(TEST_USER_KEY).roleKey(TEST_ROLE_KEY).build()));

        Assert.assertNotNull(exception);
        Assert.assertEquals(USER_NOT_ASSIGNED_ROLE+TEST_USER_KEY,exception.getMessage());
    }

    @Test
    public void setOwner_RoleKeyNotFound_Failure() {
        Mockito.when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.of(PcptActivityInst
                .builder().activityWorkflowInstKey(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY).build()));
        mockParticipantFindAllById(List.of(Participant.builder().participantKey(TEST_USER_KEY).participantStatus(APPROVED).isSponsorUser("y").build()));
        mockUserRoleFindByParticipantKeyIn(List.of(UserRole.builder().participantKey(TEST_USER_KEY).userRoleKey(TEST_ROLE_KEY).build()));
        Map<String,Object> existingVars = new HashMap<>();
        Map<String,Object> taskVars = new HashMap<>();
        existingVars.put(TEST_KEY,taskVars);
        Mockito.when(pemActivitiService.getProcessVariables(ArgumentMatchers.anyString())).thenReturn(existingVars);

        Exception exception = assertThrows(ResourceNotFoundException.class, () -> participantActivityInstServiceImpl.setOwner(TEST_SPONSOR,TEST_PCPT_ACTIVITY_INSTANCE_KEY,TEST_KEY,
                SetOwnerRequest.builder().userKey(TEST_USER_KEY).roleKey(TEST_ROLE_KEY).build()));

        Assert.assertNotNull(exception);
        Assert.assertEquals(ROLE_KEY_NOT_FOUND+TEST_ROLE_KEY,exception.getMessage());
    }


    @Test
    void testGetListofTasksAsADMIN_WithoutFilters_Success1() throws Exception {
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        mockPcptActivityInstanceKeyAndSponsorKey().thenReturn(getPcptActivityInstanceDefnObj());

        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY);
        pcptActivityInst.setActivityWorkflowInstKey(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY);

        ActivityInst activityInst = new ActivityInst();
        activityInst.setActivityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY);

        byte[] mockData = getInputSampleFile().getBytes();
        when(mockBlob.length()).thenReturn((long) mockData.length);
        when(mockBlob.getBytes(1, (int) mockBlob.length())).thenReturn(mockData);
        when(mockBlob.getBinaryStream()).thenReturn(new ByteArrayInputStream(mockData));

        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setActivityDefnDataKey(TEST_ACTIVITY_DEFN_DATA_KEY);

        ActivityDefnData activityDefnData = getVchActivityDefnDataObj();
        activityDefnData.setActivityDefnDataKey(TEST_ACTIVITY_DEFN_DATA_KEY);
        activityDefnData.setDefData(mockBlob);
        mockActivityDefnDataFindById().thenReturn(Optional.of(activityDefnData));

        List<String> taskType = List.of();
        List<String> status = List.of();

        int pageNo = 0;
        int pageSize = 10;
        SortDirection sortDir = SortDirection.ASC;

        // Mock repository interactions
        when(pcptInstRepo.findByPcptActivityInstKey(TEST_PCPT_ACTIVITY_INSTANCE_KEY)).thenReturn(pcptActivityInst);
        when(activityInstRepo.findByActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY)).thenReturn(activityInst);
        when(activityDefnVersionRepo.findByActivityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY)).thenReturn(activityDefnVersion);
        when(activityDefnDataRepo.findByActivityDefnDataKey(TEST_ACTIVITY_DEFN_DATA_KEY)).thenReturn(activityDefnData);
        when(pemActivitiService.getProcessVariables(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY)).thenReturn(new HashMap<>());
        when(pemActivitiService.getProcessStatus(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY)).thenReturn(new HashMap<>());

        // Mock participant and user role
        Participant participant = new Participant();
        participant.setParticipantRole("ADMIN");
        participant.setParticipantKey("testParticipant");
        mockParticipantFindById(participant);

        UserRole userRole = new UserRole();
        userRole.setRoleKey("roleKey");
        userRole.setParticipantKey("testParticipant");
        mockUserRoleFindByParticipantKey(userRole);

        TasksListPaginationResp response = participantActivityInstServiceImpl.getListofTasks(
                TEST_SPONSOR, TEST_PCPT_ACTIVITY_INSTANCE_KEY, taskType,
                status, pageNo, pageSize, sortDir
        );

        // Validate the response
        assertNotNull(response);
        assertNotNull(response.getContent());
        assertEquals(pageSize, response.getPageContent().getSize());
    }

    @Test
    void testGetListofTasksasADMIN_WithFilters_Success2() throws Exception {
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        mockPcptActivityInstanceKeyAndSponsorKey().thenReturn(getPcptActivityInstanceDefnObj());

        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY);
        pcptActivityInst.setActivityWorkflowInstKey(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY);

        ActivityInst activityInst = new ActivityInst();
        activityInst.setActivityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY);

        byte[] mockData = getInputSampleFile().getBytes();
        when(mockBlob.length()).thenReturn((long) mockData.length);
        when(mockBlob.getBytes(1, (int) mockBlob.length())).thenReturn(mockData);
        when(mockBlob.getBinaryStream()).thenReturn(new ByteArrayInputStream(mockData));

        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setActivityDefnDataKey(TEST_ACTIVITY_DEFN_DATA_KEY);

        ActivityDefnData activityDefnData = getVchActivityDefnDataObj();
        activityDefnData.setActivityDefnDataKey(TEST_ACTIVITY_DEFN_DATA_KEY);
        activityDefnData.setDefData(mockBlob);
        mockActivityDefnDataFindById().thenReturn(Optional.of(activityDefnData));

        List<String> taskType = Arrays.asList("PARTNER","SYSTEM");
        List<String> status = Arrays.asList("NOT_STARTED");

        int pageNo = 0;
        int pageSize = 10;
        SortDirection sortDir = SortDirection.ASC;

        // Mock repository interactions
        when(pcptInstRepo.findByPcptActivityInstKey(TEST_PCPT_ACTIVITY_INSTANCE_KEY)).thenReturn(pcptActivityInst);
        when(activityInstRepo.findByActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY)).thenReturn(activityInst);
        when(activityDefnVersionRepo.findByActivityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY)).thenReturn(activityDefnVersion);
        when(activityDefnDataRepo.findByActivityDefnDataKey(TEST_ACTIVITY_DEFN_DATA_KEY)).thenReturn(activityDefnData);
        when(pemActivitiService.getProcessVariables(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY)).thenReturn(new HashMap<>());
        when(pemActivitiService.getProcessStatus(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY)).thenReturn(new HashMap<>());

        // Mock participant and user role
        Participant participant = new Participant();
        participant.setParticipantRole("ADMIN");
        participant.setParticipantKey("testParticipant");
        mockParticipantFindById(participant);

        UserRole userRole = new UserRole();
        userRole.setRoleKey("roleKey");
        userRole.setParticipantKey("testParticipant");
        mockUserRoleFindByParticipantKey(userRole);

        TasksListPaginationResp response = participantActivityInstServiceImpl.getListofTasks(
                TEST_SPONSOR, TEST_PCPT_ACTIVITY_INSTANCE_KEY, taskType,
                status, pageNo, pageSize, sortDir
        );

        // Validate the response
        assertNotNull(response);
        assertNotNull(response.getContent());
        assertEquals(pageSize, response.getPageContent().getSize());
    }
    @Test
    void testGetListofTasksasSTANDARD_Success() throws Exception {
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        mockPcptActivityInstanceKeyAndSponsorKey().thenReturn(getPcptActivityInstanceDefnObj());

        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY);
        pcptActivityInst.setActivityWorkflowInstKey(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY);

        ActivityInst activityInst = new ActivityInst();
        activityInst.setActivityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY);

        byte[] mockData = getInputSampleFile().getBytes();
        when(mockBlob.length()).thenReturn((long) mockData.length);
        when(mockBlob.getBytes(1, (int) mockBlob.length())).thenReturn(mockData);
        when(mockBlob.getBinaryStream()).thenReturn(new ByteArrayInputStream(mockData));

        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setActivityDefnDataKey(TEST_ACTIVITY_DEFN_DATA_KEY);

        ActivityDefnData activityDefnData = getVchActivityDefnDataObj();
        activityDefnData.setActivityDefnDataKey(TEST_ACTIVITY_DEFN_DATA_KEY);
        activityDefnData.setDefData(mockBlob);
        mockActivityDefnDataFindById().thenReturn(Optional.of(activityDefnData));

        List<String> taskType = List.of();
        List<String> status = Arrays.asList("NOT_STARTED");

        int pageNo = 0;
        int pageSize = 10;
        SortDirection sortDir = SortDirection.ASC;

        // Mock repository interactions
        when(pcptInstRepo.findByPcptActivityInstKey(TEST_PCPT_ACTIVITY_INSTANCE_KEY)).thenReturn(pcptActivityInst);
        when(activityInstRepo.findByActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY)).thenReturn(activityInst);
        when(activityDefnVersionRepo.findByActivityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY)).thenReturn(activityDefnVersion);
        when(activityDefnDataRepo.findByActivityDefnDataKey(TEST_ACTIVITY_DEFN_DATA_KEY)).thenReturn(activityDefnData);
        when(pemActivitiService.getProcessVariables(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY)).thenReturn(new HashMap<>());
        when(pemActivitiService.getProcessStatus(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY)).thenReturn(new HashMap<>());

        // Mock participant and user role
        Participant participant = new Participant();
        participant.setParticipantRole("STANDARD");
        participant.setParticipantKey("testParticipant");
        mockParticipantFindById(participant);

        UserRole userRole = new UserRole();
        userRole.setRoleKey("roleKey");
        userRole.setParticipantKey("testParticipant");
        mockUserRoleFindByParticipantKey(userRole);

        TasksListPaginationResp response = participantActivityInstServiceImpl.getListofTasks(
                TEST_SPONSOR, TEST_PCPT_ACTIVITY_INSTANCE_KEY, taskType,
                status, pageNo, pageSize, sortDir
        );

        // Validate the response
        assertNotNull(response);
        assertNotNull(response.getContent());
        assertEquals(pageSize, response.getPageContent().getSize());
    }

    @Test
    void testGetListofTasksasPARTNERADMIN_Success() throws Exception {
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        mockPcptActivityInstanceKeyAndSponsorKey().thenReturn(getPcptActivityInstanceDefnObj());

        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY);
        pcptActivityInst.setActivityWorkflowInstKey(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY);

        ActivityInst activityInst = new ActivityInst();
        activityInst.setActivityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY);

        byte[] mockData = getInputSampleFile().getBytes();
        when(mockBlob.length()).thenReturn((long) mockData.length);
        when(mockBlob.getBytes(1, (int) mockBlob.length())).thenReturn(mockData);
        when(mockBlob.getBinaryStream()).thenReturn(new ByteArrayInputStream(mockData));

        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setActivityDefnDataKey(TEST_ACTIVITY_DEFN_DATA_KEY);

        ActivityDefnData activityDefnData = getVchActivityDefnDataObj();
        activityDefnData.setActivityDefnDataKey(TEST_ACTIVITY_DEFN_DATA_KEY);
        activityDefnData.setDefData(mockBlob);
        mockActivityDefnDataFindById().thenReturn(Optional.of(activityDefnData));

        List<String> taskType = List.of();
        List<String> status = Arrays.asList("NOT_STARTED");

        int pageNo = 0;
        int pageSize = 10;
        SortDirection sortDir = SortDirection.ASC;

        // Mock repository interactions
        when(pcptInstRepo.findByPcptActivityInstKey(TEST_PCPT_ACTIVITY_INSTANCE_KEY)).thenReturn(pcptActivityInst);
        when(activityInstRepo.findByActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY)).thenReturn(activityInst);
        when(activityDefnVersionRepo.findByActivityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY)).thenReturn(activityDefnVersion);
        when(activityDefnDataRepo.findByActivityDefnDataKey(TEST_ACTIVITY_DEFN_DATA_KEY)).thenReturn(activityDefnData);
        when(pemActivitiService.getProcessVariables(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY)).thenReturn(new HashMap<>());
        when(pemActivitiService.getProcessStatus(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY)).thenReturn(new HashMap<>());

        // Mock participant and user role
        Participant participant = new Participant();
        participant.setParticipantRole("PARTNER_ADMIN");
        participant.setParticipantKey("testParticipant");
        mockParticipantFindById(participant);

        UserRole userRole = new UserRole();
        userRole.setRoleKey("roleKey");
        userRole.setParticipantKey("testParticipant");
        mockUserRoleFindByParticipantKey(userRole);

        TasksListPaginationResp response = participantActivityInstServiceImpl.getListofTasks(
                TEST_SPONSOR, TEST_PCPT_ACTIVITY_INSTANCE_KEY, taskType,
                status, pageNo, pageSize, sortDir
        );

        // Validate the response
        assertNotNull(response);
        assertNotNull(response.getContent());
        assertEquals(pageSize, response.getPageContent().getSize());
    }

    @Test
    void testGetListofTasksasPARTNERSTANDARD_Success() throws Exception {
        mockGetSponsorKey().thenReturn(TEST_SPONSOR);
        mockPcptActivityInstanceKeyAndSponsorKey().thenReturn(getPcptActivityInstanceDefnObj());

        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY);
        pcptActivityInst.setActivityWorkflowInstKey(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY);

        ActivityInst activityInst = new ActivityInst();
        activityInst.setActivityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY);

        byte[] mockData = getInputSampleFile().getBytes();
        when(mockBlob.length()).thenReturn((long) mockData.length);
        when(mockBlob.getBytes(1, (int) mockBlob.length())).thenReturn(mockData);
        when(mockBlob.getBinaryStream()).thenReturn(new ByteArrayInputStream(mockData));

        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setActivityDefnDataKey(TEST_ACTIVITY_DEFN_DATA_KEY);

        ActivityDefnData activityDefnData = getVchActivityDefnDataObj();
        activityDefnData.setActivityDefnDataKey(TEST_ACTIVITY_DEFN_DATA_KEY);
        activityDefnData.setDefData(mockBlob);
        mockActivityDefnDataFindById().thenReturn(Optional.of(activityDefnData));

        List<String> taskType = List.of();
        List<String> status = Arrays.asList("NOT_STARTED");

        int pageNo = 0;
        int pageSize = 10;
        SortDirection sortDir = SortDirection.ASC;

        // Mock repository interactions
        when(pcptInstRepo.findByPcptActivityInstKey(TEST_PCPT_ACTIVITY_INSTANCE_KEY)).thenReturn(pcptActivityInst);
        when(activityInstRepo.findByActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY)).thenReturn(activityInst);
        when(activityDefnVersionRepo.findByActivityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY)).thenReturn(activityDefnVersion);
        when(activityDefnDataRepo.findByActivityDefnDataKey(TEST_ACTIVITY_DEFN_DATA_KEY)).thenReturn(activityDefnData);
        when(pemActivitiService.getProcessVariables(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY)).thenReturn(new HashMap<>());
        when(pemActivitiService.getProcessStatus(TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY)).thenReturn(new HashMap<>());

        // Mock participant and user role
        Participant participant = new Participant();
        participant.setParticipantRole("PARTNER_STANDARD");
        participant.setParticipantKey("testParticipant");
        mockParticipantFindById(participant);

        UserRole userRole = new UserRole();
        userRole.setRoleKey("roleKey");
        userRole.setParticipantKey("testParticipant");
        mockUserRoleFindByParticipantKey(userRole);

        TasksListPaginationResp response = participantActivityInstServiceImpl.getListofTasks(
                TEST_SPONSOR, TEST_PCPT_ACTIVITY_INSTANCE_KEY, taskType,
                status, pageNo, pageSize, sortDir
        );

        // Validate the response
        assertNotNull(response);
        assertNotNull(response.getContent());
        assertEquals(pageSize, response.getPageContent().getSize());
    }


    @Test
    void testGetListofTasks_PcptActivityInstNotFound() {
        Mockito.when(pcptInstRepo.findById(ArgumentMatchers.anyString())).thenReturn(Optional.empty());
        List<String> taskType = Arrays.asList("");
        List<String> status = Arrays.asList("");

        int pageNo = 0;
        int pageSize = 10;
        SortDirection sortDir = SortDirection.ASC;

        Exception exception = assertThrows(ResourceNotFoundException.class, () -> {
            participantActivityInstServiceImpl.getListofTasks(TEST_SPONSOR,TEST_PCPT_ACTIVITY_INSTANCE_KEY, taskType,status,pageNo,pageSize, sortDir);
        });

        Assert.assertNotNull(exception);
        Assert.assertEquals(PCPT_ACTIVITY_INSTANCE_NOT_FOUND,exception.getMessage());
    }




























}
