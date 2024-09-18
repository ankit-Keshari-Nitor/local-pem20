package com.precisely.pem.services;

import com.precisely.pem.enums.InstStatus;
import com.precisely.pem.commonUtil.PaginationRequest;
import com.precisely.pem.enums.Status;
import com.precisely.pem.dtos.requests.ActivityInstReq;
import com.precisely.pem.dtos.requests.ContextDataNodes;
import com.precisely.pem.dtos.requests.Partners;
import com.precisely.pem.dtos.requests.UserRequest;
import com.precisely.pem.dtos.responses.UserResponse;
import com.precisely.pem.models.*;
import com.precisely.pem.repositories.*;
import com.precisely.pem.service.BpmnConvertService;
import org.json.JSONObject;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.stubbing.OngoingStubbing;
import org.modelmapper.ModelMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

import static org.mockito.ArgumentMatchers.anyString;

/**
 * BaseService class used to implement:
 *   Common Request/Response creation
 *   Constant messages and input fields value
 *   Common mock methods
 * */
public class BaseServiceTest {

    public static final String TEST_SPONSOR = "test_sponsor";
    public static final String TEST_KEY = "test_key";
    public static final String TEST_ACTIVITY_DEFN_KEY = "test_activity_defn_key";
    public static final String TEST_ACTIVITY_DEFN_DATA_KEY = "test_activity_defn_data_key";
    public static final String TEST_ACTIVITY_DEFN_VERSION_KEY = "test_activity_defn_version_key";
    public static final String TEST_ACTIVITY_DEFN_VERSION_DATA_KEY = "test_activity_defn_version_data_key";
    public static final String TEST_FILE_KEY = "file";
    public static final String TEST_FILE_VALUE = "test.json";
    public static final String CONTENT_TYPE_TEXT = "application/json";
    public static final String TEST_FILE_DATA = "{\"name\":\"Pem Definitions 1\",\"description\":\"This is definitions 1\",\"schemaVersion\":5,\"process\":{\"nodes\":[{\"id\":\"StartNode_1\",\"type\":\"START\",\"name\":\"Start\",\"diagram\":{\"x\":200,\"y\":200}},{\"id\":\"EndNode_1\",\"type\":\"END\",\"name\":\"End\",\"diagram\":{\"x\":2500,\"y\":200}}],\"connectors\":[{\"id\":\"SequenceFlow1\",\"source\":\"StartNode_1\",\"target\":\"EndNode_1\",\"condition\":\"${condition1}\"}],\"contextData\":\"\"}}";
    public static final String TEST_APPLICATION_NAME = "name";
    public static final String TEST_DESCRIPTION = "description";
    public static final String TEST_STATUS = "status";
    public static final String TEST_APPLICATION_KEY = "application";
    public static final String TEST_NAME = "test";
    public static final String TEST_ACTIVITY_INSTANCE_KEY = "test_activity_instance_key";
    public static final String TEST_PCPT_ACTIVITY_INSTANCE_KEY = "test_pcpt_activity_instance_key";
    public static final String TEST_ACTIVITY_WORK_FLOW_INSTANCE_KEY = "activity_work_flow_inst_key";
    public static final String TEST_PARTNER_KEY = "test_partner_key";
    public static final String TEST_PARTNER_NAME = "test_partner_name";
    public static final String TEST_CURRENT_TASK_NAME = "test_current_task_name";
    public static final String TEST_BPMN_PROCESS_ID = "test_bomn_process_id";
    public static final String TEST_CONTEXT_DATA = "{\"app\":\"name\"}";
    public static final String SAMPLE_DATA = "Test Blob Data";
    public static final String CONTEXT_DATA_SAMPLE_JSON = "context_data_sample.json";
    public static final String TEST_USER_KEY = "test_user_key";
    public static final String TEST_USER_NAME = "test_user_name";
    public static final String TEST_FIRST_NAME = "test_first_name";
    public static final String TEST_LAST_NAME = "test_last_name";
    public static final String TEST_EMAIL = "test_email";
    public static final String TEST_ROLE_KEY = "test_role_key";
    public static final String TEST_ROLE_TYPE = "test_role_type";
    public static final String TEST_ROLE_NAME = "test_role_name";
    public static final String TEST_PARTICIPANT_KEY = "test_participant_key";

    public static final String ACTIVITY_DEFINITION_SAMPLE_JSON = "user_input_sample.json";
    public static final String APPROVED = "APPROVED";

    //Response Messages
    public static final String ACTIVITY_DEFINITION_NOT_FOUND = "Activity Definition with key '"+TEST_ACTIVITY_DEFN_KEY+"' not found. Kindly check the activityDefnKey.";
    public static final String ACTIVITY_DEFINITION_ALREADY_DELETED = "Activity Definition with key '" + TEST_ACTIVITY_DEFN_KEY + "' is already in Deleted state.";
    public static final String ACTIVITY_DEFINITION_VERSION_DATA_NOT_FOUND = "Activity Definition Version Data with key '"+TEST_ACTIVITY_DEFN_VERSION_DATA_KEY+"' not found. Kindly check the activityDefnDataKey.";
    public static final String ACTIVITY_DEFINITION_VERSION_NOT_FOUND = "Activity Definition Version with key '"+TEST_ACTIVITY_DEFN_VERSION_KEY+"' not found. Kindly check the activityDefnVersionKey.";
    public static final String PCPT_ACTIVITY_INSTANCE_NOT_FOUND = "PcptActivityInst with key '"+TEST_PCPT_ACTIVITY_INSTANCE_KEY+"' not found. Kindly check the pcptActivityInstKey.";
    public static final String PCPT_ACTIVITY_INSTANCE_PROCESS_DATA_NOT_FOUND = "Process Data is not found for PcptActivityInst with key " + TEST_PCPT_ACTIVITY_INSTANCE_KEY ;
    public static final String PCPT_ACTIVITY_INSTANCE_NOT_STARTED = "Pcpt activity instance not started.";
    public static final String ACTIVITY_DEFINITION_VERSION_UPDATED = "Activity Definition Version Updated.";
    public static final String ACTIVITY_DEFINITION_VERSION_REQUIRED_SINGLE_FIELD_TO_UPDATE = "Complete Request Body cannot be empty, please provide atleast one input parameter for update";
    public static final String ACTIVITY_DEFINITION_VERSION_IS_IN_FINAL_DELETE_STATUS = "Activity Definition Version is in FINAL/DELETE status.";
    public static final String ACTIVITY_DEFN_KEY_WHICH_IS_ALREADY_IN_DELETED_STATE = "Cannot Update Activity Definition with key '"+TEST_ACTIVITY_DEFN_KEY+"' which is already in Deleted state.";
    public static final String TEST_CONTEXT_DATA_FIELD = "TEST_FTP_NETMAP";
    public static final String TASK_KEY_NOT_FOUND_ERROR = "Task Key is not present in Activity Instance.";
    public static final String USER_KEY_NOT_FOUND = "User Not Found ";
    public static final String USER_NOT_APPROVED = "User Not Approved ";
    public static final String USER_NOT_ASSIGNED_ROLE = "User Does not have any role assigned ";
    public static final String ROLE_KEY_NOT_FOUND = "Role Not Found ";

    public static final String CONTEXT_DATA_FILE_RELATIVE_PATH = "..\\pem-activiti\\src\\test\\resources\\context_data_sample.json";

    @Mock
    protected ActivityDefnRepo activityDefnRepo;
    @Mock
    protected ActivityInstRepo activityInstRepo;
    @Mock
    protected SponsorRepo sponsorRepo;
    @Mock
    protected ActivityDefnDataRepo activityDefnDataRepo;
    @Mock
    protected ActivityDefnVersionRepo activityDefnVersionRepo;
    @Mock
    protected ActivityDefnDeploymentCustomRepo activityDefnDeploymentCustomRepo;
    @Mock
    protected PartnerRepo partnerRepo;
    @Mock
    protected PcptInstRepo pcptInstRepo;
    @Mock
    protected ModelMapper mapper;
    @Mock
    BpmnConvertService bpmnConvertService;
    @Mock
    protected UriComponentsBuilder uriBuilder;
    @Mock
    private ParticipantCustomRepo participantCustomRepo;
    @Mock
    ParticipantRepo participantRepo;
    @Mock
    RoleRepository roleRepository;
    @Mock
    UserRoleRepo userRoleRepo;

    //Common Mock method initialization
    public OngoingStubbing<Optional<ActivityDefn>> mockActivityDefnKey() {
        return Mockito.when(activityDefnRepo.findById(ArgumentMatchers.anyString()));
    }

    public OngoingStubbing<ActivityDefn> mockActivityDefnKeyAndSoponsorKey() {
        return Mockito.when(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(ArgumentMatchers.anyString(), ArgumentMatchers.anyString()));
    }

    public OngoingStubbing<List<ActivityDefnVersion>> mockFindByActivityDefnKey() {
        return Mockito.when(activityDefnVersionRepo.findByActivityDefnKey(ArgumentMatchers.anyString()));
    }

    protected OngoingStubbing<String> mockGetSponsorKey() {
        return Mockito.when(sponsorRepo.getSponsorKey(anyString()));
    }

    protected OngoingStubbing<ActivityDefnData> mockActivityDefnDataSave(ActivityDefnData activityDefnData) {
        return Mockito.when(activityDefnDataRepo.save(activityDefnData));
    }

    protected OngoingStubbing<Optional<ActivityDefnData>> mockActivityDefnDataFindById() {
        return Mockito.when(activityDefnDataRepo.findById(Mockito.any()));
    }

    protected OngoingStubbing<ActivityDefnVersion> mockActivityDefnVersionSave(ActivityDefnVersion activityDefnVersion) {
        return Mockito.when(activityDefnVersionRepo.save(activityDefnVersion));
    }

    protected OngoingStubbing<Optional<ActivityDefnVersion>> mockActivityDefnVersionFindById() {
        return Mockito.when(activityDefnVersionRepo.findById(Mockito.anyString()));
    }

    protected OngoingStubbing<PcptActivityInst> mockPcptActivityInstanceKeyAndSponsorKey(){
        return Mockito.when(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(Mockito.anyString(), Mockito.anyString()));
    }

    protected void mockFindUsersCustom(Page<UserResponse> userResponsePage) {
        Mockito.when(participantCustomRepo.findUsers(ArgumentMatchers.any(),ArgumentMatchers.any())).thenReturn(userResponsePage);
    }

    protected void mockParticipantFindAllById(List<Participant> participant) {
        Mockito.when(participantRepo.findAllById(ArgumentMatchers.any())).thenReturn(participant);
    }

    protected void mockParticipantFindById(Participant participant) {
        Mockito.when(participantRepo.findById(ArgumentMatchers.any())).thenReturn(Optional.of(participant));
    }

    protected void mockRoleFindById(List<Role> role) {
        Mockito.when(roleRepository.findAllById(ArgumentMatchers.any())).thenReturn(role);
    }

    protected void mockUserRoleFindByParticipantKeyIn(List<UserRole> userRole) {
        Mockito.when(userRoleRepo.findByParticipantKeyIn(ArgumentMatchers.any())).thenReturn(userRole);
    }

    protected void mockUserRoleFindByParticipantKey(UserRole userRole) {
        Mockito.when(userRoleRepo.findByParticipantKey(ArgumentMatchers.any()))
                .thenReturn(Optional.of(userRole));
    }

    //Static Request Object Creation
    protected static MultipartFile getMultipartFile() {
        return new MockMultipartFile(TEST_FILE_KEY, TEST_FILE_VALUE, CONTENT_TYPE_TEXT, TEST_FILE_DATA.getBytes());
    }

    protected  String getInputSampleFile() throws IOException {
        ClassPathResource classPathResource = new ClassPathResource(ACTIVITY_DEFINITION_SAMPLE_JSON);
        Path filePath = Paths.get(classPathResource.getURI());
        return new String(Files.readAllBytes(filePath));
    }

    protected List<ActivityDefnVersion> getPartialDraftVersionList() {
        ActivityDefnVersion v1 = new ActivityDefnVersion();
        v1.setVersion(1.0);
        v1.setStatus("DRAFT");
        v1.setIsEncrypted(false);
        v1.setIsDefault(false);
        v1.setVaultKey("123");

        ActivityDefnVersion v2 = new ActivityDefnVersion();
        v2.setVersion(1.0);
        v2.setStatus("FINAL");
        v2.setIsEncrypted(false);
        v2.setIsDefault(false);
        v2.setVaultKey("123");
        return Arrays.asList(v1,v2);
    }

    protected List<ActivityDefnVersion> getAllDraftVersionList() {
        ActivityDefnVersion v1 = new ActivityDefnVersion();
        v1.setVersion(1.0);
        v1.setStatus("DRAFT");
        v1.setIsEncrypted(false);
        v1.setIsDefault(false);
        v1.setVaultKey("123");

        ActivityDefnVersion v2 = new ActivityDefnVersion();
        v2.setVersion(1.0);
        v2.setStatus("DRAFT");
        v2.setIsEncrypted(false);
        v2.setIsDefault(false);
        v2.setVaultKey("123");
        return Arrays.asList(v1,v2);
    }

    protected ActivityDefn getDeletedVchActivityDefnObj(){
        ActivityDefn activityDefn = new ActivityDefn();
        activityDefn.setActivityName("test");
        activityDefn.setActivityDescription("test");
        activityDefn.setActivityDefnKey(UUID.randomUUID().toString());
        activityDefn.setSponsorKey(UUID.randomUUID().toString());
        activityDefn.setIsDeleted(Boolean.TRUE);
        activityDefn.setApplication("PEM");
        activityDefn.setCreatedBy("test");
        activityDefn.setCreateTs(LocalDateTime.now());
        activityDefn.setModifyTs(LocalDateTime.now());
        activityDefn.setModifiedBy("test");
        activityDefn.setMigrationStatus(false);
        return activityDefn;
    }


    protected ActivityDefn getVchActivityDefnObj(){
        ActivityDefn activityDefn = new ActivityDefn();
        activityDefn.setActivityName("test");
        activityDefn.setActivityDescription("test");
        activityDefn.setActivityDefnKey(UUID.randomUUID().toString());
        activityDefn.setSponsorKey(UUID.randomUUID().toString());
        activityDefn.setIsDeleted(false);
        activityDefn.setApplication("PEM");
        activityDefn.setCreatedBy("test");
        activityDefn.setCreateTs(LocalDateTime.now());
        activityDefn.setModifyTs(LocalDateTime.now());
        activityDefn.setModifiedBy("test");
        activityDefn.setMigrationStatus(false);
        return activityDefn;
    }

    protected List<ActivityDefn> getListOfVchActivityDefnObj(){
        ActivityDefn activityDefn = new ActivityDefn();
        activityDefn.setActivityName("test");
        activityDefn.setActivityDescription("test");
        activityDefn.setActivityDefnKey(UUID.randomUUID().toString());
        activityDefn.setSponsorKey(UUID.randomUUID().toString());
        activityDefn.setIsDeleted(false);
        activityDefn.setApplication("PEM");
        activityDefn.setCreatedBy("test");
        activityDefn.setCreateTs(LocalDateTime.now());
        activityDefn.setModifyTs(LocalDateTime.now());
        activityDefn.setModifiedBy("test");
        activityDefn.setMigrationStatus(false);

        ActivityDefn activityDefn1 = new ActivityDefn();
        activityDefn1.setActivityName("test1");
        activityDefn1.setActivityDescription("test1");
        activityDefn1.setActivityDefnKey(UUID.randomUUID().toString());
        activityDefn1.setSponsorKey(UUID.randomUUID().toString());
        activityDefn1.setIsDeleted(false);
        activityDefn1.setApplication("PP");
        activityDefn1.setCreatedBy("test1");
        activityDefn1.setCreateTs(LocalDateTime.now());
        activityDefn1.setModifyTs(LocalDateTime.now());
        activityDefn1.setModifiedBy("test1");
        activityDefn1.setMigrationStatus(false);
        return Arrays.asList(activityDefn, activityDefn1);
    }

    protected ActivityDefnData getVchActivityDefnDataObj(){
        ActivityDefnData activityDefnData = new ActivityDefnData();
        ActivityDefnVersion version = new ActivityDefnVersion();
        version.setActivityDefnVersionKey(UUID.randomUUID().toString());
        activityDefnData.setActivityDefnDataKey("test");
        activityDefnData.setActivityDefnDataKey("test");
        activityDefnData.setCreatedBy("test");
        activityDefnData.setCreateTs(LocalDateTime.now());
        activityDefnData.setActivityDefnVersion(version);
        return activityDefnData;
    }

    protected ActivityDefnVersion getVCHActivityDefnVersionObj(){
        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setActivityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY);
        activityDefnVersion.setActivityDefnKey(TEST_ACTIVITY_DEFN_KEY);
        activityDefnVersion.setVersion(0.0);
        activityDefnVersion.setActivityDefnDataKey("test");
        activityDefnVersion.setCreatedBy("test");
        activityDefnVersion.setCreateTs(LocalDateTime.now());
        activityDefnVersion.setIsDefault(true);
        activityDefnVersion.setIsEncrypted(false);
        activityDefnVersion.setVaultKey("test");
        activityDefnVersion.setModifiedBy("test");
        activityDefnVersion.setModifyTs(LocalDateTime.now());
        activityDefnVersion.setStatus("FINAL");
        return activityDefnVersion;
    }

    protected ActivityDefnVersion getDraftVCHActivityDefnVersionObj(){
        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setActivityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY);
        activityDefnVersion.setActivityDefnKey(TEST_ACTIVITY_DEFN_KEY);
        activityDefnVersion.setVersion(0.0);
        activityDefnVersion.setActivityDefnDataKey(TEST_ACTIVITY_DEFN_VERSION_DATA_KEY);
        activityDefnVersion.setCreatedBy("test");
        activityDefnVersion.setCreateTs(LocalDateTime.now());
        activityDefnVersion.setIsDefault(true);
        activityDefnVersion.setIsEncrypted(false);
        activityDefnVersion.setVaultKey("test");
        activityDefnVersion.setModifiedBy("test");
        activityDefnVersion.setModifyTs(LocalDateTime.now());
        activityDefnVersion.setStatus("DRAFT");
        return activityDefnVersion;
    }

    protected ActivityDefnVersion getDeletedVCHActivityDefnVersionObj(){
        ActivityDefnVersion activityDefnVersion = new ActivityDefnVersion();
        activityDefnVersion.setActivityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY);
        activityDefnVersion.setActivityDefnKey(TEST_ACTIVITY_DEFN_KEY);
        activityDefnVersion.setVersion(0.0);
        activityDefnVersion.setActivityDefnDataKey("test");
        activityDefnVersion.setCreatedBy("test");
        activityDefnVersion.setCreateTs(LocalDateTime.now());
        activityDefnVersion.setIsDefault(true);
        activityDefnVersion.setIsEncrypted(false);
        activityDefnVersion.setVaultKey("test");
        activityDefnVersion.setModifiedBy("test");
        activityDefnVersion.setModifyTs(LocalDateTime.now());
        activityDefnVersion.setStatus(Status.DELETE.getStatus());
        return activityDefnVersion;
    }

    protected List<PcptActivityInst> getListOfPcptActivityInstanceDefnObj(){
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptActivityInstKey(UUID.randomUUID().toString());
        pcptActivityInst.setActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY);
        pcptActivityInst.setActivityWorkflowInstKey("test");
        pcptActivityInst.setPartnerKey(TEST_PARTNER_KEY);
        pcptActivityInst.setCompletionDate(LocalDateTime.now());
        pcptActivityInst.setDueDate(LocalDateTime.now());
        pcptActivityInst.setCurrentTask(TEST_CURRENT_TASK_NAME);
        pcptActivityInst.setPcptInstStatus(TEST_STATUS);
        pcptActivityInst.setIsDeleted(false);
        pcptActivityInst.setSponsorKey("test");
        pcptActivityInst.setTaskCompleted(false);
        pcptActivityInst.setIsEncrypted(false);
        pcptActivityInst.setMailGroupKey("test");
        pcptActivityInst.setIsAlreadyRolledOut(false);

        PcptActivityInst pcptActivityInst1 = new PcptActivityInst();
        pcptActivityInst1.setPcptActivityInstKey(UUID.randomUUID().toString());
        pcptActivityInst1.setActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY);
        pcptActivityInst1.setActivityWorkflowInstKey("test1");
        pcptActivityInst1.setPartnerKey(TEST_PARTNER_KEY);
        pcptActivityInst1.setCompletionDate(LocalDateTime.now());
        pcptActivityInst1.setDueDate(LocalDateTime.now());
        pcptActivityInst1.setCurrentTask(TEST_CURRENT_TASK_NAME);
        pcptActivityInst1.setPcptInstStatus(TEST_STATUS);
        pcptActivityInst1.setIsDeleted(false);
        pcptActivityInst1.setSponsorKey("test1");
        pcptActivityInst1.setTaskCompleted(false);
        pcptActivityInst1.setIsEncrypted(false);
        pcptActivityInst1.setMailGroupKey("test1");
        pcptActivityInst1.setIsAlreadyRolledOut(false);
        return Arrays.asList(pcptActivityInst, pcptActivityInst1);
    }

    protected PcptActivityInst getPcptActivityInstanceDefnObj(){
        PcptActivityInst pcptActivityInst = new PcptActivityInst();
        pcptActivityInst.setPcptActivityInstKey(TEST_PCPT_ACTIVITY_INSTANCE_KEY);
        pcptActivityInst.setActivityInstKey(TEST_ACTIVITY_INSTANCE_KEY);
        pcptActivityInst.setActivityWorkflowInstKey("test");
        pcptActivityInst.setPartnerKey(TEST_PARTNER_KEY);
        pcptActivityInst.setCompletionDate(LocalDateTime.now());
        pcptActivityInst.setDueDate(LocalDateTime.now());
        pcptActivityInst.setCurrentTask(TEST_CURRENT_TASK_NAME);
        pcptActivityInst.setPcptInstStatus(TEST_STATUS);
        pcptActivityInst.setIsDeleted(false);
        pcptActivityInst.setSponsorKey("test");
        pcptActivityInst.setTaskCompleted(false);
        pcptActivityInst.setIsEncrypted(false);
        pcptActivityInst.setMailGroupKey("test");
        pcptActivityInst.setIsAlreadyRolledOut(false);
        return pcptActivityInst;
    }

    protected ActivityInst getActivityInstanceDefnObj(){
        return ActivityInst.builder()
                .activityInstKey(TEST_ACTIVITY_INSTANCE_KEY)
                .activityDefnKey(TEST_ACTIVITY_DEFN_KEY)
                .application(TEST_APPLICATION_NAME)
                .isEncrypted(false)
                .isCreatedByPartner(false)
                .isDeleted(false)
                .emailPref(null)
                .name(TEST_APPLICATION_NAME)
                .activityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY)
                .sponsorKey("test")
                .status(InstStatus.STARTED.getInstStatus())
                .alertFrequency(1)
                .description(TEST_DESCRIPTION)
                .defData(null)
                .startDate(LocalDateTime.now())
                .alertDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now())
                .build();
    }

    protected ActivityInstReq getActivityInstanceDefnReq(){
        ActivityInstReq activityInstReq = new ActivityInstReq();
        activityInstReq.setActivityDefnVersionKey("testVersionKey");
        String contextData = "{\"testNode\":\"originalValue\"}";
        JSONObject jsonObject = new JSONObject(contextData);
        activityInstReq.setContextData(jsonObject.toString());
        activityInstReq.setName("testActivity");
        activityInstReq.setDescription("testDescription");
        activityInstReq.setDueDate(LocalDateTime.now());
        activityInstReq.setAlertStartDate(LocalDateTime.now());
        activityInstReq.setAlertInterval(1);
        activityInstReq.setPartners(getListPartners());
        activityInstReq.setRolloutInternally(false);
        return activityInstReq;
    }

    protected List<Partners> getListPartners(){
        List<Partners> partnersList = new ArrayList<>();
        List<ContextDataNodes> contextDataNodesList = getContextDataNodes();
        Partners partners = new Partners();
        partners.setPartnerKey(TEST_PARTNER_KEY);
        partners.setContextDataNodes(contextDataNodesList);
        partnersList.add(partners);
        return partnersList;
    }

    protected com.precisely.pem.models.Partners getPartnerData(){
        com.precisely.pem.models.Partners partners = new com.precisely.pem.models.Partners();
        partners.setPartnerKey(TEST_PARTNER_KEY);
        partners.setPartnerStatus("APPROVED");
        return partners;
    }

    protected List<ContextDataNodes> getContextDataNodes(){
        List<ContextDataNodes> contextDataNodesList = new ArrayList<>();
        ContextDataNodes contextDataNodes1 = new ContextDataNodes();
        contextDataNodes1.setNodeRef("$.testNode");
        contextDataNodes1.setNodeValue("HTTPS");
        contextDataNodesList.add(contextDataNodes1);
        return contextDataNodesList;
    }

    protected List<ActivityInst> getActivityInstanceList() {
        List<ActivityInst> activityInstList = new ArrayList<>();
        ActivityInst inst1 = ActivityInst.builder()
                .activityInstKey(TEST_ACTIVITY_INSTANCE_KEY)
                .activityDefnKey(TEST_ACTIVITY_DEFN_KEY)
                .application(TEST_APPLICATION_NAME)
                .isEncrypted(false)
                .isCreatedByPartner(false)
                .isDeleted(false)
                .emailPref(null)
                .name(TEST_APPLICATION_NAME)
                .activityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY)
                .sponsorKey("test")
                .status(InstStatus.STARTED.getInstStatus())
                .alertFrequency(1)
                .description(TEST_DESCRIPTION)
                .defData(null)
                .startDate(LocalDateTime.now())
                .alertDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now())
                .build();
        ActivityInst inst2 = ActivityInst.builder()
                .activityInstKey(TEST_ACTIVITY_INSTANCE_KEY)
                .activityDefnKey(TEST_ACTIVITY_DEFN_KEY)
                .application(TEST_APPLICATION_NAME)
                .isEncrypted(false)
                .isCreatedByPartner(false)
                .isDeleted(false)
                .emailPref(null)
                .name(TEST_APPLICATION_NAME)
                .activityDefnVersionKey(TEST_ACTIVITY_DEFN_VERSION_KEY)
                .sponsorKey("test")
                .status(InstStatus.STARTED.getInstStatus())
                .alertFrequency(1)
                .description(TEST_DESCRIPTION)
                .defData(null)
                .startDate(LocalDateTime.now())
                .alertDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now())
                .build();
        activityInstList.add(inst1);
        activityInstList.add(inst2);
        return activityInstList;
    }

    public static PaginationRequest getPageReq() {
        return PaginationRequest.builder()
                .pageNo(0)
                .pageSize(10)
                .sortDir("ASC")
                .sortBy("modifyTs")
                .build();
    }

    protected static UserRequest getUserRequest() {
        return UserRequest.builder()
                .sponsorKey(TEST_SPONSOR)
                .partnerKey(TEST_PARTNER_KEY)
                .build();
    }

    protected static UserResponse getUserResponseDefault(String prefix) {
        return UserResponse.builder()
                .userKey(TEST_USER_KEY+prefix)
                .userName(TEST_USER_NAME+prefix)
                .lastName(TEST_LAST_NAME+prefix)
                .firstName(TEST_FIRST_NAME+prefix)
                .email(TEST_EMAIL+prefix).build();
    }

}
