package com.precisely.pem.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.spi.json.JsonOrgJsonProvider;
import com.precisely.pem.enums.Application;
import com.precisely.pem.enums.InstStatus;
import com.precisely.pem.enums.PcptInstStatus;
import com.precisely.pem.enums.Status;
import com.precisely.pem.dtos.requests.ActivityInstReq;
import com.precisely.pem.dtos.requests.ContextDataNodes;
import com.precisely.pem.dtos.requests.Partners;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.shared.ActivityInstDto;
import com.precisely.pem.dtos.shared.PaginationDto;
import com.precisely.pem.dtos.shared.PcptActivityInstDto;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.exceptionhandler.InvalidStatusException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.models.*;
import com.precisely.pem.repositories.*;
import com.precisely.pem.service.PEMActivitiService;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.json.JSONException;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
public class ActivityInstServiceImpl implements ActivityInstService{

    @Autowired
    ActivityDefnRepo activityDefnRepo;

    @Autowired
    ActivityDefnDataRepo activityDefnDataRepo;


    @Autowired
    PEMActivitiService pemActivitiService;


    @Autowired
    ActivityDefnVersionRepo activityDefnVersionRepo;

    @Autowired
    ActivityInstRepo activityInstRepo;

    @Autowired
    PcptInstRepo pcptInstRepo ;

    @Autowired
    PartnerRepo partnerRepo;

    @Autowired
    private ModelMapper mapper;


    @Override
    @Transactional
    public ActivityInstResp createActivityInstance(String sponsorContext, ActivityInstReq activityInstReq) throws ResourceNotFoundException, SQLException, JsonProcessingException, JSONException, InvalidStatusException {
        ActivityInstResp activityInstResp = new ActivityInstResp();
        ActivityInst activityInst = null;
        ActivityInstDto activityInstDto = null;

        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);

        ActivityDefnVersion activityDefnVersion = activityDefnVersionRepo.findByActivityDefnVersionKey(activityInstReq.getActivityDefnVersionKey());
        if(Objects.isNull(activityDefnVersion) || activityDefnVersion.getActivityDefnVersionKey().isEmpty()){
            throw new ResourceNotFoundException("NoDataFound", "No data was found for activity version key '" + activityInstReq.getActivityDefnVersionKey() + "'.");
        } else if (!activityDefnVersion.getStatus().equalsIgnoreCase(Status.FINAL.getStatus())) {
            throw new InvalidStatusException("NotInFinalStatus", "The activity version with key '"+ activityDefnVersion.getActivityDefnVersionKey() +"' is not in the 'FINAL' state.");
        }

        JSONObject contextData = new JSONObject(activityInstReq.getContextData());

        Configuration configuration = Configuration.builder()
                .jsonProvider(new JsonOrgJsonProvider())
                .build();

        byte[] bytes = contextData.toString().getBytes(StandardCharsets.UTF_8);
        Blob blob = new SerialBlob(bytes);

        activityInstDto = ActivityInstDto.builder()
                .activityInstKey(UUID.randomUUID().toString())
                .activityDefnVersionKey(activityInstReq.getActivityDefnVersionKey())
                .activityDefnKey(activityDefnVersion.getActivityDefnKey())
                .name(activityInstReq.getName())
                .description(activityInstReq.getDescription())
                .status(InstStatus.STARTED.getInstStatus())
                .startDate(LocalDateTime.now().toString())
                .dueDate(activityInstReq.getDueDate().toLocalDate().toString())
                .endDate(null)
                .alertDate(activityInstReq.getAlertStartDate().toLocalDate().toString())
                .alertFrequency(activityInstReq.getAlertInterval())
                .defData(blob)
                .isEncrypted(false)
                .isDeleted(false)
                .isCreatedByPartner(false)
                .application(Application.PEM.getApp())
                .sponsorKey(sponsorInfo.getSponsorKey())
                .emailPref(null)
        .build();

        activityInst = mapper.map(activityInstDto, ActivityInst.class);
        activityInstRepo.save(activityInst);

        if(!activityInstReq.getRolloutInternally()) {
            validatePartners(activityInstReq.getPartners());
            for(Partners partner : activityInstReq.getPartners()){
                PcptActivityInst pcptActivityInst = null;
                PcptActivityInstDto pcptActivityInstDto = null;
                Blob pcptBlob = null;
                DocumentContext json = null;

                for(ContextDataNodes nodes : partner.getContextDataNodes()) {
                    json = JsonPath.using(configuration).parse(contextData).set(nodes.getNodeRef(),nodes.getNodeValue());
                }

                byte[] pcptBytes = json.json().toString().getBytes(StandardCharsets.UTF_8);
                pcptBlob = new SerialBlob(pcptBytes);

                pcptActivityInstDto = PcptActivityInstDto.builder()
                        .pcptActivityInstKey(UUID.randomUUID().toString())
                        .activityInstKey(activityInstDto.getActivityInstKey())
                        .activityWorkflowInstKey("")
                        .partnerKey(partner.getPartnerKey())
                        .completionDate(null)
                        .dueDate(activityInstDto.getDueDate())
                        .pcptInstStatus(PcptInstStatus.NOT_STARTED.getPcptInstStatus())
                        .sponsorKey(sponsorInfo.getSponsorKey())
                        .isDeleted(false)
                        .taskCompleted(false)
                        .isEncrypted(false)
                        .mailGroupKey("")
                        .isAlreadyRolledOut(false)
                        .pcptContextData(pcptBlob)
                        .build();

                pcptActivityInst = mapper.map(pcptActivityInstDto, PcptActivityInst.class);
                pcptInstRepo.save(pcptActivityInst);
            }
        }

        activityInstResp.setActivityInstKey(activityInstDto.getActivityInstKey());
        return activityInstResp;
    }

    @Override
    public ActivityInstListResp getInstanceByKey(String sponsorContext, String activityInstKey) throws ResourceNotFoundException {
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        ActivityInstListResp activityInstListResp = new ActivityInstListResp();

        ActivityInst activityInst = activityInstRepo.findByActivityInstKey(activityInstKey);
        if (Objects.isNull(activityInst))
            throw new ResourceNotFoundException("activityInstanceKey", "NoDataFound", "Activity Instance with key '" + activityInstKey + "' not found. Kindly check the activityInstKey.");

        activityInstListResp = mapper.map(activityInst,ActivityInstListResp.class);
        return activityInstListResp;
    }

    @Override
    public ActivityInstPagnResp getAllInstanceList(String sponsorContext, String name, String description, String status, String activityDefnVersionKey, String partnerKey, Boolean activityStats, int pageNo, int pageSize, String sortBy, String sortDir) throws ResourceNotFoundException {
        ActivityInstPagnResp resp = new ActivityInstPagnResp();
        PaginationDto paginationDto = new PaginationDto();
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        Page<ActivityInst> defnsPage = null;
        if(name != null && !name.isEmpty() && name.contains("con:") && description != null && !description.isEmpty() && activityDefnVersionKey != null && !activityDefnVersionKey.isEmpty()) {
            String conName = name.replace("con:","");
            System.out.println("conName="+conName);
            defnsPage = activityInstRepo.findBySponsorKeyAndNameContainingAndDescriptionContainingAndActivityDefnVersionKeyAndStatus(sponsorInfo.getSponsorKey(),
                    conName, description, activityDefnVersionKey, status, pageable);
        }else if(name != null && !name.isEmpty() && !name.contains("con:") && description != null && !description.isEmpty() && activityDefnVersionKey != null && !activityDefnVersionKey.isEmpty()) {
            defnsPage = activityInstRepo.findBySponsorKeyAndNameAndDescriptionContainingAndActivityDefnVersionKeyAndStatus(sponsorInfo.getSponsorKey(),
                    name, description, activityDefnVersionKey, status, pageable);
        }else if(name != null && !name.isEmpty() && name.contains("con:") && activityDefnVersionKey != null && !activityDefnVersionKey.isEmpty()) {
            String conName = name.replace("con:","");
            System.out.println("conName="+conName);
            defnsPage = activityInstRepo.findBySponsorKeyAndNameContainingAndStatusAndAndActivityDefnVersionKey(sponsorInfo.getSponsorKey(),
                    conName, status, activityDefnVersionKey, pageable);
        }else if(name != null && !name.isEmpty() && !name.contains("con:") && activityDefnVersionKey != null && !activityDefnVersionKey.isEmpty()) {
            defnsPage = activityInstRepo.findBySponsorKeyAndNameAndStatusAndAndActivityDefnVersionKey(sponsorInfo.getSponsorKey(),
                    name, status, activityDefnVersionKey, pageable);
        }else if(description != null && !description.isEmpty() && activityDefnVersionKey != null && !activityDefnVersionKey.isEmpty()) {
            defnsPage = activityInstRepo.findBySponsorKeyAndDescriptionContainingAndActivityDefnVersionKeyAndStatus(sponsorInfo.getSponsorKey(),
                    description, activityDefnVersionKey, status, pageable);
        }else if(activityDefnVersionKey != null && !activityDefnVersionKey.isEmpty()){
            defnsPage = activityInstRepo.findBySponsorKeyAndActivityDefnVersionKeyAndStatus(sponsorInfo.getSponsorKey(),
                    activityDefnVersionKey, status, pageable);
        } else if (description != null && !description.isEmpty()) {
            defnsPage = activityInstRepo.findBySponsorKeyAndDescriptionContainingAndStatus(sponsorInfo.getSponsorKey(), description,
                    status, pageable);
        } else if (name != null && !name.isEmpty() && name.contains("con:")) {
            String conName = name.replace("con:","");
            System.out.println("conName="+conName);
            defnsPage = activityInstRepo.findBySponsorKeyAndNameContainingAndStatus(sponsorInfo.getSponsorKey(),
                    conName, status, pageable);
        }else if(name != null && !name.isEmpty() && !name.contains("con:")) {
            defnsPage = activityInstRepo.findBySponsorKeyAndNameAndStatus(sponsorInfo.getSponsorKey(),
                    name, status, pageable);
        }else{
            defnsPage = activityInstRepo.findBySponsorKeyAndStatus(sponsorInfo.getSponsorKey(), status, pageable);
        }
        if(defnsPage == null || defnsPage.isEmpty()) {
            throw new ResourceNotFoundException("","NoDataFound", "No data was found for the provided query parameter combination.");
        }
        List<ActivityInst> listOfDefns = defnsPage.getContent();
        List<ActivityInstListResp> defnContent = new ArrayList<>();
        defnContent = listOfDefns.stream()
                .map(p -> mapper.map(p, ActivityInstListResp.class))
                .collect(Collectors.toList());

        int totalPage = defnsPage.getTotalPages();
        long totalElements = defnsPage.getTotalElements();
        int size = defnsPage.getSize();

        paginationDto.setNumber(pageNo);
        paginationDto.setSize(size);
        paginationDto.setTotalPages(totalPage);
        paginationDto.setTotalElements(totalElements);

        resp.setContent(defnContent);
        resp.setPage(paginationDto);
        return resp;
    }

    @Override
    public ActivityInstStatsResp getActivityInstStatsByKey(String sponsorContext, String activityInstKey) throws ResourceNotFoundException, IOException, SQLException {
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        ActivityInstStatsResp activityInstStatsResp = new ActivityInstStatsResp();
        LocalDate currentDate = LocalDate.now();
        ActivityInst activityInst = activityInstRepo.findByActivityInstKey(activityInstKey);
        if (Objects.isNull(activityInst))
            throw new ResourceNotFoundException("activityInstanceKey", "NoDataFound", "Activity Instance with key '" + activityInstKey + "' not found. Kindly check the activityInstKey.");
        List<PcptActivityInst> pcptActivityInsts = pcptInstRepo.findByActivityInstKey(activityInstKey);

        int partners = pcptActivityInsts.size();
        int completed = 0;
        int sponsorAction = 0;
        int delayed = 0;
        int onSchedule = 0;

        List<ActivityDefnVersion> activityDefnVersionList = activityDefnVersionRepo.findByActivityDefnKey(activityInst.getActivityDefnKey());
        if(!activityDefnVersionList.isEmpty()){
            ActivityDefnData activityDefnData = activityDefnDataRepo.findByActivityDefnDataKey(activityDefnVersionList.get(0).getActivityDefnDataKey());
            if(activityDefnData != null){
                byte[] activityDataByte = null;
                activityDataByte = activityDefnData.getDefData().getBytes(1, (int) activityDefnData.getDefData().length());
                String activityDataStr = new String(activityDataByte);
            }
        }

        if(!pcptActivityInsts.isEmpty()){
            for (PcptActivityInst pcptActivityInst : pcptActivityInsts) {
                if (pcptActivityInst.getPcptInstStatus().equalsIgnoreCase("Completed")) {
                    completed++;
                }
                if (pcptActivityInst.getPcptInstStatus().equalsIgnoreCase("ApprovalPending")){
                    sponsorAction++;
                }

                if (pcptActivityInst.getDueDate() != null) {
                    LocalDateTime dueDateTime = pcptActivityInst.getDueDate();
                    LocalDate dueDate = dueDateTime.toLocalDate();
                    if (dueDate.isBefore(currentDate)) {
                        delayed++;
                    } else {
                        onSchedule++;
                    }
                }else{
                    onSchedule++;
                }
            }
        }

        activityInstStatsResp.setParticipants(partners);
        activityInstStatsResp.setCompleted(completed);
        activityInstStatsResp.setSponsorAction(sponsorAction);
        activityInstStatsResp.setDelayed(delayed);
        activityInstStatsResp.setOnSchedule(onSchedule);

        return activityInstStatsResp;
    }

    private SponsorInfo validateSponsorContext(String sponsorContext) throws ResourceNotFoundException {
        SponsorInfo sponsorInfo = TenantContext.getTenantContext();
        if(Objects.isNull(sponsorInfo)){
            throw new ResourceNotFoundException("sponsorContext", "SponsorIssue", "Sponsor '" + sponsorContext + "' not found. Kindly check the sponsorContext.");
        }
        log.info("sponsorkey : " + sponsorInfo.getSponsorKey());
        return sponsorInfo;
    }

    private void validatePartners(List<Partners> partners) throws ResourceNotFoundException {
        ArrayList<String> invalidPartnerKey = new ArrayList<>();
        ArrayList<String> noPartnerKey = new ArrayList<>();
        if(!Objects.isNull(partners) && ((long) partners.size() != 0)){
            for(Partners partner : partners){
                Optional<com.precisely.pem.models.Partners> partnerData=partnerRepo.findById(partner.getPartnerKey());
                if(partnerData.isEmpty()){
                    noPartnerKey.add(partner.getPartnerKey());
                } else if(!partnerData.get().getPartnerStatus().equalsIgnoreCase("APPROVED")) {
                    invalidPartnerKey.add(partner.getPartnerKey());
                }
            }
            if(!noPartnerKey.isEmpty()) {
                throw new ResourceNotFoundException("Partner", "The Partner with keys " + noPartnerKey + " not found. Please check partner details.");
            }
            if(!invalidPartnerKey.isEmpty()) {
                throw new ResourceNotFoundException("Partner", "The Partner with keys " + invalidPartnerKey + " are not 'APPROVED'. Please check partner details.");
            }
        }
    }
}
