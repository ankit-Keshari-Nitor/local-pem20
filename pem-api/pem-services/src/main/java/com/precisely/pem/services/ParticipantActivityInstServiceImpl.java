package com.precisely.pem.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.ReadContext;
import com.jayway.jsonpath.spi.json.JsonOrgJsonProvider;
import com.precisely.pem.commonUtil.ApplicationConstants;
import com.precisely.pem.dtos.shared.ActivityTaskDto;
import com.precisely.pem.enums.PcptInstProgress;
import com.precisely.pem.enums.PcptInstStatus;
import com.precisely.pem.converter.AbstractNodeHandler;
import com.precisely.pem.dtos.Node;
import com.precisely.pem.dtos.PemBpmnModel;
import com.precisely.pem.dtos.shared.*;
import com.precisely.pem.dtos.requests.ProcessDataEvaluation;
import com.precisely.pem.dtos.requests.SetOwnerRequest;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.task.TaskDTO;
import com.precisely.pem.enums.SortDirection;
import com.precisely.pem.exceptionhandler.InvalidStatusException;
import com.precisely.pem.exceptionhandler.ParamMissingException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.models.*;
import com.precisely.pem.repositories.*;
import com.precisely.pem.service.BpmnConvertService;
import com.precisely.pem.service.PEMActivitiService;
import lombok.extern.log4j.Log4j2;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
public class ParticipantActivityInstServiceImpl implements ParticipantActivityInstService {

    public static final String USER_KEY = "userKey";
    public static final String ROLE_KEY = "roleKey";
    @Autowired
    private CompanyRepo companyRepo;
    @Autowired
    private PartnerRepo partnerRepo;
    @Autowired
    private PcptInstRepo pcptInstRepo;
    @Autowired
    private ActivityInstRepo activityInstRepo;
    @Autowired
    private ModelMapper mapper;

    @Autowired
    PEMActivitiService pemActivitiService;

    @Autowired
    private ActivityDefnVersionRepo activityDefnVersionRepo;
    @Autowired
    private ActivityDefnRepo activityDefnRepo;
    @Autowired
    private ActivityDefnDataRepo activityDefnDataRepo;
    @Autowired
    private BpmnConvertService bpmnConvertService;

    @Autowired
    ActivityProcDefRepo activityProcDefRepo;
    @Autowired
    ParticipantRepo participantRepo;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    UserRoleRepo userRoleRepo;
    @Autowired
    CompanyUserRepo companyUserRepo;

    //TODO will change once identity server code is present
    @Value("${participant-key}")
    private String participantKey;

    @Override
    public ParticipantActivityInstPaginationResp getAllParticipantActivityInstances(String sponsorContext, String status, String activityInstKey,String activityDefnVersionKey, Boolean activityStats, String currentTask, String partnerName, String progress, int pageNo, int pageSize, String sortDir) throws Exception {
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        ParticipantActivityInstPaginationResp participantActivityInstPaginationResp = new ParticipantActivityInstPaginationResp();
        PaginationPcptInstDto paginationPcptInstDto = new PaginationPcptInstDto();
        ActivityInstStatsDto activityInstStatsDto = new ActivityInstStatsDto();
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by("modifyTs").ascending()
                : Sort.by("modifyTs").descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<PcptActivityInst> defnsPage = null;
        if(activityInstKey.isEmpty() && activityDefnVersionKey.isEmpty()){
            throw new ParamMissingException("","InputParamNeeded","Either one of the two parameters activityInstKey and activityDefnVersionKey is required, both cannot be empty");
        }
        if (activityInstKey.isEmpty() || activityDefnVersionKey.isEmpty()) {
            if(activityInstKey.isEmpty()){
                activityInstKey = activityInstRepo.findByActivityDefnVersionKey(activityDefnVersionKey).getActivityInstKey();
            }
        }
        if(status != null && !status.isEmpty() && currentTask != null && !currentTask.isEmpty() && partnerName != null && !partnerName.isEmpty() && progress != null && !progress.isEmpty()){
            Date currentDate = Date.valueOf(LocalDateTime.now().toLocalDate());
            if(progress == PcptInstProgress.DELAYED.toString()){
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndPartnerNameAndDelayedProgress(sponsorInfo.getSponsorKey(), activityInstKey, PcptInstStatus.valueOf(status).getPcptInstStatus(), currentTask, partnerName, currentDate.toString(), pageable);
            }else {
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndPartnerNameAndOnScheduleProgress(sponsorInfo.getSponsorKey(), activityInstKey, PcptInstStatus.valueOf(status).getPcptInstStatus(), currentTask, partnerName,currentDate.toString(), pageable);
            }
        }
        else  if(status != null && !status.isEmpty() && currentTask != null && !currentTask.isEmpty() && partnerName != null && !partnerName.isEmpty()){
            defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndPartnerName(sponsorInfo.getSponsorKey(), activityInstKey, PcptInstStatus.valueOf(status).getPcptInstStatus(), currentTask, partnerName, pageable);
        }
        else if(status != null && !status.isEmpty() && currentTask != null && !currentTask.isEmpty() && progress != null && !progress.isEmpty()) {
            LocalDateTime currentDate = LocalDateTime.now();
            if (progress == PcptInstProgress.DELAYED.toString()) {
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndDelayedProgress(sponsorInfo.getSponsorKey(), activityInstKey, PcptInstStatus.valueOf(status).getPcptInstStatus(), currentTask,currentDate.toString(), pageable);
            }else{
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTaskAndOnScheduleProgress(sponsorInfo.getSponsorKey(), activityInstKey, PcptInstStatus.valueOf(status).getPcptInstStatus(), currentTask,currentDate.toString(), pageable);
            }
        }
        else if(status != null && !status.isEmpty() && partnerName != null && !partnerName.isEmpty() && progress != null && !progress.isEmpty()){
            LocalDateTime currentDate = LocalDateTime.now();
            if (progress == PcptInstProgress.DELAYED.toString()) {
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndPartnerNameAndDelayedProgress(sponsorInfo.getSponsorKey(), activityInstKey, PcptInstStatus.valueOf(status).getPcptInstStatus(), partnerName,currentDate.toString(), pageable);
            }else{
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndPartnerNameAndOnScheduleProgress(sponsorInfo.getSponsorKey(), activityInstKey, PcptInstStatus.valueOf(status).getPcptInstStatus(), partnerName,currentDate.toString(), pageable);
            }
        }
        else if(status != null && !status.isEmpty() && currentTask != null && !currentTask.isEmpty()){
            defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndCurrentTask(sponsorInfo.getSponsorKey(), activityInstKey,PcptInstStatus.valueOf(status).getPcptInstStatus(), currentTask, pageable);
        }
        else if(status != null && !status.isEmpty() && partnerName != null && !partnerName.isEmpty()){
            defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndPartnerName(sponsorInfo.getSponsorKey(), activityInstKey, PcptInstStatus.valueOf(status).getPcptInstStatus(), partnerName, pageable);

        }
        else if(status != null && !status.isEmpty() && progress != null && !progress.isEmpty()){
            LocalDateTime currentDate = LocalDateTime.now();
            if (progress == PcptInstProgress.DELAYED.toString()) {
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndDelayedProgress(sponsorInfo.getSponsorKey(),activityInstKey,PcptInstStatus.valueOf(status).getPcptInstStatus(),currentDate.toString(),pageable);
            }else{
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatusAndOnScheduleProgress(sponsorInfo.getSponsorKey(),activityInstKey,PcptInstStatus.valueOf(status).getPcptInstStatus(),currentDate.toString(),pageable);
            }
        }
        else if(partnerName != null && !partnerName.isEmpty() && progress != null && !progress.isEmpty()){
            LocalDateTime currentDate = LocalDateTime.now();
            if (progress == PcptInstProgress.DELAYED.toString()) {
                defnsPage =  pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPartnerNameAndDelayedProgress(sponsorInfo.getSponsorKey(),activityInstKey,partnerName,currentDate.toString(),pageable);
            }else{
                defnsPage =  pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPartnerNameAndOnScheduleProgress(sponsorInfo.getSponsorKey(),activityInstKey,partnerName,currentDate.toString(),pageable);
            }

        }else if(progress != null && !progress.isEmpty()){
            LocalDateTime currentDate = LocalDateTime.now();
            if (progress == PcptInstProgress.DELAYED.toString()) {
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndDelayedProgress(sponsorInfo.getSponsorKey(),activityInstKey,currentDate.toString(),pageable);
            }else{
                defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndOnScheduleProgress(sponsorInfo.getSponsorKey(),activityInstKey,currentDate.toString(),pageable);
            }
        }
        else if(status != null && !status.isEmpty()){
            defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKeyAndPcptInstStatus(sponsorInfo.getSponsorKey(),activityInstKey,PcptInstStatus.valueOf(status).getPcptInstStatus(),pageable);
        }
        else {
            defnsPage = pcptInstRepo.findBySponsorKeyAndActivityInstKey(sponsorInfo.getSponsorKey(),activityInstKey, pageable);
        }
        if(defnsPage == null || defnsPage.isEmpty()) {
            return participantActivityInstPaginationResp;
        }


        List<PcptActivityInst> listOfDefns = defnsPage.getContent();
        List<ParticipantActivityInstListResp> defnContent = new ArrayList<>();
        defnContent = listOfDefns.stream()
                .map(p ->
                {
                    ParticipantActivityInstListResp resp = mapper.map(p, ParticipantActivityInstListResp.class);
                    try {
                        Blob contextDataBlob = p.getPcptContextData();
                        if (contextDataBlob != null) {
                            try (InputStream inputStream = contextDataBlob.getBinaryStream();
                                 ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

                                byte[] buffer = new byte[4096];
                                int bytesRead;
                                while ((bytesRead = inputStream.read(buffer)) != -1) {
                                    outputStream.write(buffer, 0, bytesRead);
                                }

                                String contextDataString = new String(outputStream.toByteArray(), StandardCharsets.UTF_8);
                                resp.setContextData(contextDataString);
                            }
                        } else {
                            resp.setContextData("");
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    return resp;
                }).collect(Collectors.toList());


        String finalActivityInstKey = activityInstKey;

        Map<String, String> partnerNameMap = new HashMap<>();
        Map<String, String> startDateMap = new HashMap<>();
        Map<String, String> applicationMap = new HashMap<>();
        Map<String, ActivityInstStatsDto> activityStatsMap = new HashMap<>();

        defnContent.forEach(item -> {
            String partnerKey = item.getPartner().getPartnerKey();
            if (partnerKey != null && !partnerNameMap.containsKey(partnerKey)) {
                Partners partner = partnerRepo.findByPartnerKey(partnerKey);
                if (partner != null) {
                    String companyKey = partner.getCompanyKey();
                    Company company = companyRepo.findByCompanyKey(companyKey);
                    String companyName = company != null ? company.getCompanyName() : "Unknown";
                    // Store the company name in the map with the partner key
                    partnerNameMap.put(partnerKey, companyName);
                }
            }

            ActivityInst activityInstance = activityInstRepo.findById(finalActivityInstKey).orElse(null);
            if (activityInstance != null) {
                String startDate = String.valueOf(activityInstance.getStartDate());
                startDateMap.put(finalActivityInstKey, startDate!=null ? startDate:null);
                applicationMap.put(finalActivityInstKey, activityInstance.getApplication());
            }

            ActivityInstStatsDto activityInstStatsDto1 = new ActivityInstStatsDto();
            if (activityStats) {
                activityInstStatsDto.setTasksCompleted(0);
                activityInstStatsDto.setTasksSkipped(0);
                activityInstStatsDto.setEstimatedDelay(0);
                activityInstStatsDto.setEstimatedCompletionDate(LocalDate.now().toString());
            }
            activityStatsMap.put(finalActivityInstKey, activityInstStatsDto1);
        });

        defnContent.forEach(item -> {
            String partnerKey = item.getPartner().getPartnerKey();
            if (partnerKey != null) {
                String companyName = partnerNameMap.getOrDefault(partnerKey, "Unknown");
                item.getPartner().setPartnerName(companyName);
            }
            if(activityStats) { item.setActivityStats(activityInstStatsDto); }
            String finalActivityInstKey1 = item.getActivityInstKey();
            if (finalActivityInstKey1 != null) {
                item.setStartDate(startDateMap.getOrDefault(finalActivityInstKey1, "Unknown"));
                item.setApplication(applicationMap.getOrDefault(finalActivityInstKey1, "Unknown"));
                if(activityStats){
                    ActivityInstStatsDto activityInstStatsDto1 = activityStatsMap.get(finalActivityInstKey);
                    item.setActivityStats(activityInstStatsDto1);
                }
            }
        });

        int totalPage = defnsPage.getTotalPages();
        long totalElements = defnsPage.getTotalElements();
        int size = defnsPage.getSize();

        paginationPcptInstDto.setNumber(pageNo);
        paginationPcptInstDto.setSize(size);
        paginationPcptInstDto.setTotalPages(totalPage);
        paginationPcptInstDto.setTotalElements(totalElements);

        participantActivityInstPaginationResp.setContent(defnContent);
        participantActivityInstPaginationResp.setPageContent(paginationPcptInstDto);

        return participantActivityInstPaginationResp;
    }

    @Override
    public ParticipantActivityInstResp getParticipantActivityInstanceByKey(String sponsorContext, String pcptActivityInstKey) throws Exception {
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        Optional<PcptActivityInst> result = Optional.ofNullable(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(sponsorInfo.getSponsorKey(),pcptActivityInstKey));
        if (result.isEmpty()) {
            throw new ResourceNotFoundException("", "NoDataFound", "No data was found for the provided query parameter combination.");
        }
        ModelMapper mapper = new ModelMapper();
        ParticipantActivityInstResp participantActivityInstResp = mapper.map(result.get(), ParticipantActivityInstResp.class);

        Blob contextDataBlob = result.get().getPcptContextData();
        if (contextDataBlob != null) {
            try (InputStream inputStream = contextDataBlob.getBinaryStream();
                 ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
                String contextDataString = new String(outputStream.toByteArray(), StandardCharsets.UTF_8);
                participantActivityInstResp.setContextData(contextDataString);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            participantActivityInstResp.setContextData("");
        }

        if (participantActivityInstResp.getPartner().getPartnerKey() != null) {
            Partners partner = partnerRepo.findByPartnerKey(participantActivityInstResp.getPartner().getPartnerKey());
            if (partner != null) {
                String companyKey = partner.getCompanyKey();
                Company company = companyRepo.findByCompanyKey(companyKey);
                String companyName = company != null ? company.getCompanyName() : "Unknown";
                participantActivityInstResp.getPartner().setPartnerName(companyName);
            }
        }

        ActivityInst activityInstance = activityInstRepo.findById(participantActivityInstResp.getActivityInstKey()).orElse(null);
        if (activityInstance != null) {
            String startDate = String.valueOf(activityInstance.getStartDate());
            participantActivityInstResp.setApplication(activityInstance.getApplication());
            participantActivityInstResp.setStartDate(startDate !=null ? startDate:null);
        }
        return participantActivityInstResp;
    }

    @Override
    public MessageResp startActivity(String sponsorContext, String pcptActivityInstKey) throws ResourceNotFoundException, InvalidStatusException {
        PcptActivityInst pcptActivityInst = pcptInstRepo.findByPcptActivityInstKey(pcptActivityInstKey);
        if(Objects.isNull(pcptActivityInst)){
            throw new ResourceNotFoundException("PcptInstanceNotFound", "The participant instance with key '" + pcptActivityInstKey + "' not found.");
        }
        if(pcptActivityInst.getPcptInstStatus().equalsIgnoreCase(PcptInstStatus.STARTED.getPcptInstStatus()))
            throw new ResourceNotFoundException("AlreadyInStartedStatus", "The participant instance with key '" + pcptActivityInstKey + "' not found.");

        String activityInstanceKey = pcptActivityInst.getActivityInstKey();
        ActivityInst activityInst = activityInstRepo.findByActivityInstKey(activityInstanceKey);
        if(Objects.isNull(activityInst)){
            throw new ResourceNotFoundException("ActivityInstanceNotFound", "The activity instance with key '" + activityInstanceKey + "' not found.");
        }
        String activityDefnVersionKey = activityInst.getActivityDefnVersionKey();
        ActivityDefnVersion activityDefnVersion =  activityDefnVersionRepo.findByActivityDefnVersionKey(activityDefnVersionKey);
        if(Objects.isNull(activityDefnVersion)){
            throw new ResourceNotFoundException("ActivityVersionNotFound", "The activity definition version with key '" + activityDefnVersionKey + "' not found.");
        }

        ActivityDefnData activityDefnData = activityDefnDataRepo.findByActivityDefnDataKey(activityDefnVersion.getActivityDefnDataKey());

        Blob contextDataBlob = pcptActivityInst.getPcptContextData();
        byte[] contextDataByte = null;
        byte[] activityDataByte = null;
        try {
            contextDataByte = contextDataBlob.getBytes(1, (int) contextDataBlob.length());
            activityDataByte = activityDefnData.getDefData().getBytes(1, (int) activityDefnData.getDefData().length());
        }catch (Exception e){
            log.info(e);
        }
        if(contextDataByte == null)
            throw new ResourceNotFoundException("NA", "The contextDataByte is empty.");
        if(Objects.isNull(activityDataByte))
            throw new ResourceNotFoundException("NA", "The Activity Definition Version Data is empty.");

        String contextDataStr = new String(contextDataByte);
        String activityDataStr = new String(activityDataByte);

        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> map = null;
        Map<String, Object> processData = new HashMap<>();
        try{
            map = mapper.readValue(contextDataStr, new TypeReference<>() {});
            processData.put("contextData",map);

            PemBpmnModel pemBpmnModel = mapper.readValue(activityDataStr, new TypeReference<>() {});
            addUserCredentialsInProcessData(pemBpmnModel.getProcess().getNodes(), processData);

        }catch (Exception e){
            log.info(e);
        }

        String processInstanceId = pemActivitiService.startProcessInstanceByKey("ID-"+activityDefnVersionKey,processData);
        log.info("processInstanceId = "+processInstanceId);
        if(Objects.isNull(processInstanceId)){
            throw new ResourceNotFoundException("CouldNotStartInstance", "The participant activity instance could not be started. Kindly check.");
        }
        pcptActivityInst.setActivityWorkflowInstKey(processInstanceId);
        pcptActivityInst.setPcptInstStatus(PcptInstStatus.STARTED.getPcptInstStatus());
        pcptInstRepo.save(pcptActivityInst);
        return MessageResp.builder()
                .response("SUCCESS")
                .build();
    }

    private static void addUserCredentialsInProcessData(List<Node> nodes, Map<String, Object> processData) {
        for(Node node : nodes){
            if (AbstractNodeHandler.isPartnerOrSponsorProcess(node.getType())){
                Map<String,Object> assignMap = new HashMap<>();
                assignMap.put(USER_KEY,Objects.isNull(node.getUserKeys()) ? "" : node.getUserKeys());
                assignMap.put(ROLE_KEY,Objects.isNull(node.getRoleKeys()) ? "" : node.getRoleKeys());
                processData.put(node.getId(),assignMap);
            }
        }
    }

    @Override
    public ProcessEvaluationResponse evaluatePaths(String pcptActivityInstKey, ProcessDataEvaluation jsonPath) throws Exception {
        Optional<PcptActivityInst> pcptActivityInst = pcptInstRepo.findById(pcptActivityInstKey);
        if (pcptActivityInst.isEmpty()) {
            throw new ResourceNotFoundException("pcptActivityInstKey", "NoDataFound", "PcptActivityInst with key '" + pcptActivityInstKey + "' not found. Kindly check the pcptActivityInstKey.");
        }

        if(Objects.isNull(pcptActivityInst.get().getActivityWorkflowInstKey())){
            throw new ResourceNotFoundException("activityWorkflowInstKey", "NoDataFound", "Pcpt activity instance not started.");
        }

        ProcessEvaluationResponse response = new ProcessEvaluationResponse();
        List<ProcessEvaluationResponse.Result> processEvaluationResult = new ArrayList<>();

        Map<String,Object> processVars = pemActivitiService.getProcessVariables(pcptActivityInst.get().getActivityWorkflowInstKey());
        ObjectMapper mapper = new ObjectMapper();
        String processDataString = mapper.writeValueAsString(processVars);
        if (Objects.isNull(processVars) || processVars.isEmpty()){
            throw new ResourceNotFoundException("ProcessData", "NoDataFound","Process Data is not found for PcptActivityInst with key " + pcptActivityInstKey );
        }
        Configuration conf = Configuration.defaultConfiguration();
        conf.jsonProvider( new JsonOrgJsonProvider());
        ReadContext ctx = JsonPath.using(conf).parse(processDataString);

        for(String path : jsonPath.getPaths()){
            ProcessEvaluationResponse.Result result = new ProcessEvaluationResponse.Result();
            result.setPath(path);
            result.setValue(ctx.read(path));
            processEvaluationResult.add(result);
        }
        response.setProcessEvaluationResult(processEvaluationResult);
        return response;
    }

    @Override
    public ActivityTaskDto getNodeDetails(String sponsorContext, String pcptActivityInstKey, String taskKey) throws Exception {
        ActivityTaskDto activityTaskDto = null;
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        Optional<PcptActivityInst> result = Optional.ofNullable(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(sponsorInfo.getSponsorKey(),pcptActivityInstKey));
        if(result.isPresent()) {
            PcptActivityInst pcptActivityInst = result.get();
            if(pcptActivityInst.getPcptInstStatus().equalsIgnoreCase(PcptInstStatus.STARTED.getPcptInstStatus())){
                TaskDTO taskDTO = pemActivitiService.getUserNodeDetails(taskKey);
                activityTaskDto = mapper.map(taskDTO, ActivityTaskDto.class);
            } else{
                throw new ResourceNotFoundException("NA", "The PCPT instance is not in the necessary status to get the task details, Current status is " + pcptActivityInst.getPcptInstStatus());
            }
        }else
            throw new ResourceNotFoundException("NA", "PCPT Instance not found.");

        return activityTaskDto;
    }

    @Override
    public BaseResourceResp completeNode(String sponsorContext, String pcptActivityInstKey, String taskKey, String data, Boolean isDraft) throws Exception {
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        JSONObject dataObj = null;
        if(data != null && !data.isEmpty()){
            try {
                dataObj = new JSONObject(data);
            }catch (Exception e){
                throw new ResourceNotFoundException("NA", "Data should not be null and needed in JSON format.");
            }
            if(dataObj.isEmpty())
                throw new ResourceNotFoundException("NA", "Data has not any key-value pair");
        }
        Optional<PcptActivityInst> result = Optional.ofNullable(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(sponsorInfo.getSponsorKey(),pcptActivityInstKey));
        if(result.isPresent()) {
            PcptActivityInst pcptActivityInst = result.get();
            if(pcptActivityInst.getPcptInstStatus().equalsIgnoreCase(PcptInstStatus.STARTED.getPcptInstStatus())){
                assert dataObj != null;

                TaskDTO taskDTO = pemActivitiService.getUserNodeDetails(taskKey);
                if (taskDTO.getFormNodeType().equals(ApplicationConstants.CUSTOM_FORM_NODE) && (data == null || data.isBlank())) {
                    throw new ParamMissingException("formData", null, "formData is missing for the form node");
                }

                if(isDraft != null && !isDraft) {
                    pemActivitiService.completeUserNode(taskKey, dataObj.toString());
                }else {
                    Map<String , Object>  newItem = new HashMap<>();
                    newItem.put("draft",dataObj.toString());
                    pemActivitiService.setTaskVariables(taskKey, newItem);
                }
            } else{
                throw new ResourceNotFoundException("NA", "The PCPT instance is not in the necessary status to submit the task, Current status is " + pcptActivityInst.getPcptInstStatus());
            }
        }else {
            throw new ResourceNotFoundException("NA", "PCPT Instance not found.");
        }
        return new BaseResourceResp("Success",LocalDateTime.now().toString());
    }

    @Override
    public BaseResourceResp setOwner(String sponsorContext, String pcptActivityInstKey, String taskKey, SetOwnerRequest ownerRequest) throws ResourceNotFoundException {
        PcptActivityInst pcptActivityInst = validateBeforeOwnerAssignment(pcptActivityInstKey, ownerRequest);
        String processInstanceId = pcptActivityInst.getActivityWorkflowInstKey();

        boolean assigned = pemActivitiService.setOwnerToRunningTasks(processInstanceId,List.of(ownerRequest.getUserKey().split(",")),List.of(ownerRequest.getRoleKey().split(",")));
        if(!assigned){
            throw new ResourceNotFoundException("setOwnerToRunningTasks","NoDataFound","Failed to assign user/role to Running Tasks.");
        }
        Map<String, Object> existingProcessVars = pemActivitiService.getProcessVariables(processInstanceId);
        if( !existingProcessVars.containsKey(taskKey))
            throw new ResourceNotFoundException("taskKey","NoDataFound","Task Key is not present in Activity Instance.");

        Map<String, Object> taskVariables = (Map<String, Object> )existingProcessVars.get(taskKey);
        taskVariables.put(USER_KEY,ownerRequest.getUserKey());
        taskVariables.put(ROLE_KEY,ownerRequest.getRoleKey());
        pemActivitiService.setProcessVariable(processInstanceId,taskKey,taskVariables);
        return new BaseResourceResp("Success",LocalDateTime.now().toString());
    }

    private PcptActivityInst validateBeforeOwnerAssignment(String pcptActivityInstKey, SetOwnerRequest ownerRequest) throws ResourceNotFoundException {
        Optional<PcptActivityInst> pcptActivityInst = pcptInstRepo.findById(pcptActivityInstKey);
        if (pcptActivityInst.isEmpty()) {
            throw new ResourceNotFoundException("pcptActivityInstKey", "NoDataFound", "PcptActivityInst with key '" + pcptActivityInstKey + "' not found. Kindly check the pcptActivityInstKey.");
        }

        if(Objects.isNull(pcptActivityInst.get().getActivityWorkflowInstKey())){
            throw new ResourceNotFoundException("activityWorkflowInstKey", "NoDataFound", "Pcpt activity instance not started.");
        }

        List<String> userKeys = List.of(ownerRequest.getUserKey().split(","));
        List<Participant> participants =  participantRepo.findAllById(userKeys);

        Map<String, Participant> participantMap = participants.stream()
                .collect(Collectors.toMap(Participant::getParticipantKey, participant -> participant));

        List<String> participantKeys = new ArrayList<>();
        for(String userKey : userKeys){
            if (!participantMap.containsKey(userKey)){
                throw new ResourceNotFoundException("userKey", "NoDataFound", "User Not Found "+userKey);
            }
            participantKeys.add(userKey);
            if(!participantMap.get(userKey).getParticipantStatus().equalsIgnoreCase("APPROVED")){
                throw new ResourceNotFoundException("userKey", "NoDataFound", "User Not Approved "+userKey);
            }
        }

        List<UserRole> userRoles = userRoleRepo.findByParticipantKeyIn(participantKeys);
        Map<String, UserRole> userRoleMap = userRoles.stream()
                .collect(Collectors.toMap(UserRole::getParticipantKey, userRole -> userRole));
        for(String userKey : userKeys){
            if (!userRoleMap.containsKey(userKey)){
                throw new ResourceNotFoundException("userKey", "NoDataFound", "User Does not have any role assigned "+userKey);
            }
        }
        List<String> roleKeys = List.of(ownerRequest.getRoleKey().split(","));
        List<Role> roles = roleRepository.findAllById(roleKeys);
        Map<String, Role> roleMap = roles.stream()
                .collect(Collectors.toMap(Role::getRoleKey, role -> role));
        for (String roleKey : roleKeys){
            if (!roleMap.containsKey(roleKey)){
                throw new ResourceNotFoundException("roleKey", "NoDataFound", "Role Not Found "+roleKey);
            }
        }
        return pcptActivityInst.get();
    }

    @Override
    public TasksListPaginationResp getListofTasks(String sponsorContext, String pcptActivityInstKey, List<String> taskType, List<String> status, int pageNo, int pageSize, SortDirection sortDir) throws Exception {
        SponsorInfo sponsorInfo = TenantContext.getTenantContext();
        PcptActivityInst pcptActivityInst = pcptInstRepo.findByPcptActivityInstKey(pcptActivityInstKey);
        if(Objects.isNull(pcptActivityInst)){
            throw new ResourceNotFoundException("PcptInstanceNotFound", "PcptActivityInst with key '" + pcptActivityInstKey + "' not found. Kindly check the pcptActivityInstKey.");
        }

        TasksListPaginationResp tasksListPaginationResp = new TasksListPaginationResp();
        PaginationDto paginationDto = new PaginationDto();
        List<TasksListResp> tasksLists = new ArrayList<>();
        Optional<Participant> participant = participantRepo.findById(participantKey);
        String userRole = "";
        if(participant.isPresent()){
            userRole = participant.get().getParticipantRole();
        }
        String roleKey = "";
        Optional<UserRole> vchUserRole = userRoleRepo.findByParticipantKey(participantKey);
        if(vchUserRole.isPresent()){
            roleKey = vchUserRole.get().getRoleKey();
        }

        String activityInstanceKey = pcptActivityInst.getActivityInstKey();
        ActivityInst activityInst = activityInstRepo.findByActivityInstKey(activityInstanceKey);
        if(Objects.isNull(activityInst)){
            throw new ResourceNotFoundException("ActivityInstanceNotFound", "The activity instance with key '" + activityInstanceKey + "' not found.");
        }
        String activityDefnVersionKey = activityInst.getActivityDefnVersionKey();
        ActivityDefnVersion activityDefnVersion =  activityDefnVersionRepo.findByActivityDefnVersionKey(activityDefnVersionKey);
        if(Objects.isNull(activityDefnVersion)){
            throw new ResourceNotFoundException("ActivityVersionNotFound", "The activity definition version with key '" + activityDefnVersionKey + "' not found.");
        }

        ActivityDefnData activityDefnData = activityDefnDataRepo.findByActivityDefnDataKey(activityDefnVersion.getActivityDefnDataKey());
        byte[] activityDataByte = null;
        try {
            activityDataByte = activityDefnData.getDefData().getBytes(1, (int) activityDefnData.getDefData().length());
        }catch (Exception e){
            log.info(e);
        }
        if(Objects.isNull(activityDataByte))
            throw new ResourceNotFoundException("NA", "The Activity Definition Version Data is empty.");
        String activityDataStr = new String(activityDataByte);

        String processInstanceId = pcptActivityInst.getActivityWorkflowInstKey();
        Map<String, Object> existingProcessVars = pemActivitiService.getProcessVariables(processInstanceId);
        Map<String, Object> processStatusMap = pemActivitiService.getProcessStatus(processInstanceId);

        ObjectMapper mapper = new ObjectMapper();
        try{
            PemBpmnModel pemBpmnModel = mapper.readValue(activityDataStr, new TypeReference<>() {});
            returnTaskListBasedOnUserRole(participantKey,userRole,roleKey, pemBpmnModel, existingProcessVars, tasksLists);
        }catch (Exception e){
            log.info(e);
        }

        // Map additional fields
        tasksLists.forEach(task -> {
            task.setPcptActivityInstKey(pcptActivityInst.getPcptActivityInstKey());
            task.setStartDate("");
            task.setEndDate("");
            task.setErrorMessage("");
            task.setSponsorKey(sponsorInfo.getSponsorKey());
            task.setStatus(task.getTaskType().equalsIgnoreCase("SYSTEM") ? "" : "NOT_STARTED");

            String taskId = task.getTaskKey();

            if (processStatusMap.containsKey(taskId)) {
                Map<String, Object> taskData = (Map<String, Object>) processStatusMap.get(taskId);

                String taskStatus = (String) taskData.get("Status");
                java.util.Date startTime = (java.util.Date) taskData.get("StartTime");
                java.util.Date endTime = (java.util.Date) taskData.get("EndTime");
                Boolean isExecutable = (Boolean) taskData.get("isExecutable");
                String errorDetails = (String) taskData.get("ErrorDetails");
                List<String> nextExecutableNodes = (List<String>) taskData.get("NextExecutableNode");

                // Set values from the map
                task.setStatus(taskStatus != null ? taskStatus : task.getStatus());
                task.setStartDate(startTime != null ? startTime.toString() : task.getStartDate());
                task.setEndDate(endTime != null ? endTime.toString() : task.getEndDate());
                task.setExecutable(isExecutable != null ? isExecutable : task.getIsExecutable());
                task.setErrorMessage(errorDetails != null ? errorDetails : task.getErrorMessage());
                task.setNextExecutableNodes(nextExecutableNodes != null ? nextExecutableNodes : task.getNextExecutableNodes());
            }
        });



        // Apply filters based on taskType and status
        List<TasksListResp> filteredTasks = tasksLists.stream()
                .filter(task -> (taskType == null || taskType.isEmpty() || taskType.contains(task.getTaskType())))
                .filter(task -> (status == null || status.isEmpty() || status.contains(task.getStatus())))
                .collect(Collectors.toList());

        // Comparator for sorting tasks by status and endTime
        Comparator<TasksListResp> compositeComparator = Comparator
                .comparing(TasksListResp::getStatus, Comparator.comparing(taskStatus -> {
                    switch (taskStatus) {
                        case "InProgress":
                            return 1;
                        case "Completed":
                            return 2;
                        default: // "Not Started" or any other status
                            return 3;
                    }
                }))
                .thenComparing(TasksListResp::getEndDate, Comparator.nullsLast(Comparator.naturalOrder()));

        // Sort the list of tasks by the composite comparator and direction
        List<TasksListResp> sortedTasks = filteredTasks.stream()
                .sorted(sortDir == SortDirection.ASC ? compositeComparator : compositeComparator.reversed())
                .collect(Collectors.toList());

        // Pagination
        int totalTasks = sortedTasks.size();
        int totalPages = (int) Math.ceil((double) totalTasks / pageSize);
        int start = Math.min(pageNo * pageSize, totalTasks);
        int end = Math.min((pageNo + 1) * pageSize, totalTasks);

        List<TasksListResp> paginatedTasks = sortedTasks.subList(start, end);

        paginationDto.setNumber(pageNo);
        paginationDto.setSize(pageSize);
        paginationDto.setTotalPages(totalPages);
        paginationDto.setTotalElements(totalTasks);

        tasksListPaginationResp.setContent(paginatedTasks);
        tasksListPaginationResp.setPageContent(paginationDto);

        return tasksListPaginationResp;
    }

    private void returnTaskListBasedOnUserRole(String participantKey,String userRole,String roleKey, PemBpmnModel pemBpmnModel, Map<String ,Object> existingProcessVars, List<TasksListResp> tasksLists){
        for(Node node : pemBpmnModel.getProcess().getNodes()){
            if(userRole.equalsIgnoreCase("ADMIN") || userRole.equalsIgnoreCase("DIVISION_ADMIN")
                    || userRole.equalsIgnoreCase("ENGAGEMENT_ADMINISTRATOR") || userRole.equalsIgnoreCase("SYSTEM")) {
                if (AbstractNodeHandler.isSubProcess(node.getType())){
                    processNodes(node,existingProcessVars,tasksLists);
                }
            } else if (userRole.equalsIgnoreCase("STANDARD") || userRole.equalsIgnoreCase("DIVISION_NON_ADMIN")
                    || userRole.equalsIgnoreCase("POWER")) {
                if (AbstractNodeHandler.isSubProcess(node.getType())) {
                    processNodesBasedOnPermission(participantKey,roleKey,node,existingProcessVars,tasksLists);
                }
            } else if (userRole.equalsIgnoreCase("PARTNER_ADMIN")) {
                if (AbstractNodeHandler.isPartnerSubProcess(node.getType())) {
                    processNodes(node, existingProcessVars, tasksLists);
                }
            } else if (userRole.equalsIgnoreCase("PARTNER_STANDARD")) {
                if (AbstractNodeHandler.isPartnerSubProcess(node.getType())){
                    processNodesBasedOnPermission(participantKey,roleKey,node,existingProcessVars,tasksLists);
                }
            } else {
                log.info("No Tasks Found");
            }
        }
    }

    private void processNodes(Node node, Map<String ,Object> existingProcessVars, List<TasksListResp> tasksLists){
        if (existingProcessVars.containsKey(node.getId())) {
            Map<String, Object> taskVariables = (Map<String, Object>) existingProcessVars.get(node.getId());
            String companyUserKey = resolveCompanyUserKey(node, taskVariables);
            traverseNodes(node, tasksLists, companyUserKey);
        }else{
            traverseNodes(node, tasksLists, "");
        }
    }
    private void processNodesBasedOnPermission(String userKey,String roleKey, Node node, Map<String ,Object> existingProcessVars, List<TasksListResp> tasksLists){
        if (existingProcessVars.containsKey(node.getId())) {
            if (existingProcessVars.containsKey(node.getId())) {
                Map<String, Object> taskVariables = (Map<String, Object>) existingProcessVars.get(node.getId());
                if (userKey.equalsIgnoreCase((String) taskVariables.get(USER_KEY)) ||
                        roleKey.equalsIgnoreCase((String) taskVariables.get(ROLE_KEY))) {
                    String companyUserKey = resolveCompanyUserKey(node, taskVariables);
                    traverseNodes(node, tasksLists, companyUserKey);
                }
            }
        }
    }

    private String resolveCompanyUserKey(Node node, Map<String, Object> taskVariables) {
        String userKey = (String) taskVariables.get(USER_KEY);
        String roleKey = (String) taskVariables.get(ROLE_KEY);

        // Scenario 1: Check if user_key is present and has length > 0
        if (userKey != null && !userKey.trim().isEmpty()) {
            Optional<Participant> optionalParticipant = participantRepo.findById(userKey);
            if (optionalParticipant.isPresent()) {
                return optionalParticipant.get().getCompanyUserKey();
            }
        }

        // Scenario 2: user_key is empty/null, check nodeUserKeys
        String nodeUserKey = node.getUserKeys();
        if (nodeUserKey != null && !nodeUserKey.trim().isEmpty()) {
            Optional<Participant> optionalParticipant = participantRepo.findById(nodeUserKey);
            if (optionalParticipant.isPresent()) {
                return optionalParticipant.get().getCompanyUserKey();
            }
        }

        // Scenario 3: Both user_key and nodeUserKey are empty, check role_key
        if (roleKey != null && !roleKey.trim().isEmpty()) {
            Optional<UserRole> optionalUserRole = userRoleRepo.findByRoleKey(roleKey);
            if (optionalUserRole.isPresent()) {
                Optional<Participant> optionalParticipant = participantRepo.findById(optionalUserRole.get().getParticipantKey());
                if (optionalParticipant.isPresent()) {
                    return optionalParticipant.get().getCompanyUserKey();
                }
            }
        }

        // Scenario 4: Both user_key, nodeUserKey, and role_key are empty, check nodeRoleKeys
        String nodeRoleKey = node.getRoleKeys();
        if (nodeRoleKey != null && !nodeRoleKey.trim().isEmpty()) {
            Optional<UserRole> optionalUserRole = userRoleRepo.findByRoleKey(nodeRoleKey);
            if (optionalUserRole.isPresent()) {
                Optional<Participant> optionalParticipant = participantRepo.findById(optionalUserRole.get().getParticipantKey());
                if (optionalParticipant.isPresent()) {
                    return optionalParticipant.get().getCompanyUserKey();
                }
            }
        }

        // Fallback: If all keys are empty or null
        return "";
    }

    private void traverseNodes(Node node, List<TasksListResp> tasksLists,String companyUserKey) {
        TasksListResp task = new TasksListResp();
        task.setTaskKey(node.getId());
        task.setName(node.getName());
        task.setTaskType(node.getType());
        if(!companyUserKey.isEmpty() && companyUserKey != null){
            OwnerDetailsDto ownerDetailsDto = getOwnerDetails(companyUserKey);
            task.setOwnerName(ownerDetailsDto.getOwnerName());
            task.setOwnerEmail(ownerDetailsDto.getOwnerEmail());
        }else{
            task.setOwnerName("");
            task.setOwnerEmail("");
        }
        tasksLists.add(task);
    }

    private OwnerDetailsDto getOwnerDetails(String companyUserKey) {
        Optional<CompanyUser> companyUser = Optional.ofNullable(companyUserRepo.findByCompanyUserKey(companyUserKey));
        OwnerDetailsDto ownerDetailsDto = new OwnerDetailsDto();
        if(companyUser.isPresent()){
            ownerDetailsDto.setOwnerName(companyUser.get().getFirstName() + " " + companyUser.get().getLastName());
            ownerDetailsDto.setOwnerEmail(companyUser.get().getUserName());
        }
        return ownerDetailsDto;
    }

    @Override
    public Map<String, Object> getProcessStatus(String sponsorContext, String pcptActivityInstKey, String userRole) throws Exception {
        SponsorInfo sponsorInfo = TenantContext.getTenantContext();
        Optional<PcptActivityInst> result = Optional.ofNullable(pcptInstRepo.findBySponsorKeyAndPcptActivityInstKey(sponsorInfo.getSponsorKey(), pcptActivityInstKey));
        if (result.isEmpty()) {
            throw new ResourceNotFoundException("", "NoDataFound", "No data was found for the provided query parameter combination.");
        }
        PcptActivityInst pcptActivityInst = result.get();
        return pemActivitiService.getProcessStatus(pcptActivityInst.getActivityWorkflowInstKey(), userRole);
    }

    private SponsorInfo validateSponsorContext(String sponsorContext) throws ResourceNotFoundException {
        SponsorInfo sponsorInfo = TenantContext.getTenantContext();
        if(Objects.isNull(sponsorInfo)){
            throw new ResourceNotFoundException("sponsorContext", "SponsorIssue", "Sponsor '" + sponsorContext + "' not found. Kindly check the sponsorContext.");
        }
        return sponsorInfo;
    }

}
