package com.precisely.pem.services;

import com.precisely.pem.Validator.StatusEnumValidator;
import com.precisely.pem.commonUtil.ApplicationConstants;
import com.precisely.pem.enums.Status;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.dtos.requests.ActivityDefnReq;
import com.precisely.pem.dtos.requests.UpdateActivityReq;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.shared.*;
import com.precisely.pem.exceptionhandler.*;
import com.precisely.pem.models.ActivityDefn;
import com.precisely.pem.models.ActivityDefnData;
import com.precisely.pem.models.ActivityDefnVersion;
import com.precisely.pem.repositories.*;
import com.precisely.pem.service.BpmnConvertService;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.rowset.serial.SerialBlob;
import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.precisely.pem.commonUtil.CommonServiceUtil.convertInputStreamToByteArray;
import static com.precisely.pem.commonUtil.CommonServiceUtil.validateJsonUsingJSONSchema;

@Log4j2
@Service
public class ActivityDefnServiceImpl implements ActivityDefnService {
    @Autowired
    private SponsorRepo sponsorRepo;
    @Autowired
    private ActivityDefnRepo activityDefnRepo;
    @Autowired
    private ActivityDefnDataRepo activityDefnDataRepo;
    @Autowired
    private ActivityDefnVersionRepo activityDefnVersionRepo;
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private ActivityDefinitionVersionCustomRepo activityDefinitionVersionCustomRepo;
    @Autowired
    private BpmnConvertService bpmnConvertService;
    @Autowired
    private ActivityDefnCustomRepo activityDefnCustomRepo;

    @Override
    public ActivityDefnPaginationRes getAllDefinitionList(String sponsorContext, String name,
                                                          String description, String application, List<String> status,
                                                          int pageNo, int pageSize, String sortBy, String sortDir) throws Exception {
        ActivityDefnPaginationRes vchActivityDefinitionPaginationRes = new ActivityDefnPaginationRes();
        PaginationDto paginationDto = new PaginationDto();
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        Page<ActivityDefn> defnsPage = null;
        status = getStatusListOfString(status);

        defnsPage = activityDefnCustomRepo.getActivityDefnsPage(name, description, status, application, sponsorInfo.getSponsorKey(), pageable);

        if (defnsPage == null || defnsPage.getContent().isEmpty()) {
            return vchActivityDefinitionPaginationRes;
        }

        List<ActivityDefn> listOfDefns = defnsPage.getContent();
        List<ActivityDefnListResp> defnContent = new ArrayList<>();

        defnContent = listOfDefns.stream()
                .map(p -> {
                    List<ActivityDefnVersion> versionList = p.getVersions();
                    ActivityVersionResp activityVersionResp = new ActivityVersionResp();
                    if (versionList != null && !versionList.isEmpty()) {
                        activityVersionResp = mapper.map(versionList.stream().filter(ActivityDefnVersion::getIsDefault).findAny().get(), ActivityVersionResp.class);
                    }
                    ActivityDefnListResp activityDefnListResp = mapper.map(p, ActivityDefnListResp.class);
                    activityDefnListResp.setDefaultVersion(activityVersionResp);
                    return activityDefnListResp;
                }).collect(Collectors.toList());

        int totalPage = defnsPage.getTotalPages();
        long totalElements = defnsPage.getTotalElements();
        int size = defnsPage.getSize();

        paginationDto.setNumber(pageNo);
        paginationDto.setSize(size);
        paginationDto.setTotalPages(totalPage);
        paginationDto.setTotalElements(totalElements);

        vchActivityDefinitionPaginationRes.setContent(defnContent);
        vchActivityDefinitionPaginationRes.setPageContent(paginationDto);

        return vchActivityDefinitionPaginationRes;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ActivityDefnResp createActivityDefinition(String sponsorContext, ActivityDefnReq activityDefnReq) throws IOException, SQLException, DuplicateEntryException, ResourceNotFoundException, BpmnConverterException, SchemaValidationException, XMLStreamException {
        ActivityDefnResp activityDefnResp = new ActivityDefnResp();
        ActivityDefn activityDefnobj = null;
        ActivityDefnData activityDefnData = null;
        ActivityDefnVersion activityDefnVersion = null;
        ModelMapper mapper = new ModelMapper();

        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);

        Optional<ActivityDefn> duplicateEntry = Optional.ofNullable(activityDefnRepo.findByActivityName(activityDefnReq.getName()));
        if (duplicateEntry.isPresent()) {
            throw new DuplicateEntryException("name;DuplicateEntry;Entry already exists in database for name '" + duplicateEntry.get().getActivityName() + "'");
        }

        //Validation of JSON schema
        List<SchemaValidationDto> validationMessages = validateJsonUsingJSONSchema(activityDefnReq.getFile().getInputStream());
        if (!validationMessages.isEmpty()) {
            throw new SchemaValidationException(validationMessages);
        }

        byte[] data = convertInputStreamToByteArray(activityDefnReq.getFile().getInputStream());
        Blob blob =new SerialBlob(data);

        //Populating the Activity Definition Object
        ActivityDefnDto activityDefnDto = new ActivityDefnDto(
                UUID.randomUUID().toString(), sponsorInfo.getSponsorKey(), activityDefnReq.getName(),
                activityDefnReq.getDescription(), LocalDateTime.now(), "", LocalDateTime.now(), "",
                activityDefnReq.getApplication().toString(), false, false, null);
        activityDefnobj = mapper.map(activityDefnDto, ActivityDefn.class);
        activityDefnobj = activityDefnRepo.save(activityDefnobj);

        ActivityDefnVersionDto activityDefnVersionDto = new ActivityDefnVersionDto(
                UUID.randomUUID().toString(), activityDefnobj.getActivityDefnKey(),
                null, ApplicationConstants.DEFAULT_VERSION,
                String.valueOf(Status.DRAFT), true, false,
                "", LocalDateTime.now(), "", LocalDateTime.now(),
                "", ApplicationConstants.SCHEMA_VERSION, activityDefnReq.getDescription());
        activityDefnVersion = mapper.map(activityDefnVersionDto, ActivityDefnVersion.class);

        activityDefnVersion.setActivityDefnVersionKey(UUID.randomUUID().toString());

        // Validating BPMN schema
        bpmnConvertService.getBpmnConvertedInbyte(activityDefnReq.getFile().getInputStream(),
                BpmnConverterRequest.builder()
                        .processId(activityDefnVersion.getActivityDefnVersionKey())
                        .build());

        ActivityDefnDataDto vchActivityDefnDataDto = new ActivityDefnDataDto(
                UUID.randomUUID().toString(), blob, LocalDateTime.now(),
                "", LocalDateTime.now(), ""
        );

        //Populating the Activity Definition Version Object
        activityDefnData = mapper.map(vchActivityDefnDataDto, ActivityDefnData.class);
        activityDefnData.setActivityDefnVersion(activityDefnVersion);
        activityDefnData = activityDefnDataRepo.save(activityDefnData);

        //update ActivityDefnDataKey activity definition version
        activityDefnVersion.setActivityDefnDataKey(activityDefnData.getActivityDefnDataKey());
        activityDefnVersion.setActivityDefnData(activityDefnData);
        activityDefnVersion = activityDefnVersionRepo.save(activityDefnVersion);

        activityDefnResp.setActivityDefnKey(activityDefnobj.getActivityDefnKey());
        activityDefnResp.setActivityDefnVersionKey(activityDefnVersion.getActivityDefnVersionKey());

        return activityDefnResp;
    }

    @Override
    public ActivityDefnListResp getActivityDefinitionByKey(String sponsorContext, String activityDefnKey) throws Exception {
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        Optional<ActivityDefn> result = Optional.ofNullable(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(activityDefnKey, sponsorInfo.getSponsorKey()));
        ;
        if (result.isEmpty()) {
            throw new ResourceNotFoundException("NoDataFound", "No data was found for the provided query parameter combination.");
        }
        ModelMapper mapper = new ModelMapper();
        return mapper.map(result.get(), ActivityDefnListResp.class);
    }

    @Override
    public MessageResp updateActivityDefinitionByKey(String sponsorContext, String activityDefnKey, UpdateActivityReq updateActivityReq) throws Exception {
        SponsorInfo sponsorInfo = validateSponsorContext(sponsorContext);
        Optional<ActivityDefn> activityDefn = activityDefnRepo.findById(activityDefnKey);
        if (activityDefn.isEmpty()) {
            throw new ResourceNotFoundException("activityDefnKey", "NoDataFound", "Activity Definition with key '" + activityDefnKey + "' not found. Kindly check the activityDefnKey.");
        }
        if (activityDefn.get().getIsDeleted()) {
            throw new AlreadyDeletedException("activityDefnKey", "AlreadyDeleted", "Cannot Update Activity Definition with key '" + activityDefnKey + "' which is already in Deleted state.");
        }
        if (updateActivityReq.getName().isEmpty() && updateActivityReq.getDescription().isEmpty()) {
            throw new ParamMissingException("", "InputParamNeeded", "Both Activity name & description cannot be empty, please provide atleast one input parameter for update");
        }
        if (!updateActivityReq.getDescription().isEmpty()) {
            activityDefn.get().setActivityDescription(updateActivityReq.getDescription());
        }
        if (!updateActivityReq.getName().isEmpty()) {
            activityDefn.get().setActivityName(updateActivityReq.getName());
        }
        activityDefnRepo.save(activityDefn.get());
        MessageResp messsageResp = MessageResp.builder().build();
        messsageResp.setResponse("Activity Name & Description Update successful");
        return messsageResp;

    }

    @Override
    public MessageResp deleteActivityDefinitionByKey(String sponsorContext, String activityDefnKey) throws Exception {
        validateSponsorContext(sponsorContext);
        String sponsorKey = TenantContext.getTenantContext().getSponsorKey();
        Optional<ActivityDefn> activityDefnOptional = Optional.ofNullable(activityDefnRepo.findByActivityDefnKeyAndSponsorKey(activityDefnKey, sponsorKey));

        if (activityDefnOptional.isEmpty())
            throw new ResourceNotFoundException("activityDefnKey", "NoDataFound", "Activity Definition with key '" + activityDefnKey + "' not found. Kindly check the activityDefnKey.");

        if (activityDefnOptional.get().getIsDeleted()) {
            throw new AlreadyDeletedException("activityDefnKey", "AlreadyDeleted", "Activity Definition with key '" + activityDefnKey + "' is already in Deleted state.");
        }

        /*
        Conditions
            1.All Versions are in DRAFT, hard delete all Data from tables
            2.If any one Version apart from DRAFT present, Mark that status as DELETE and IS_DELETED in Activity Defn as TRUE and hard Delete all DRAFT Versions
         */
        //check count of Versions with Status other than DRAFT
        long count = activityDefnVersionRepo.countByActivityDefnKeyAndStatusNot(activityDefnOptional.get().getActivityDefnKey(), Status.DRAFT.getStatus());

        MessageResp response = MessageResp.builder().build();
        if (count == 0) {
            activityDefnRepo.deleteById(activityDefnKey);
            response.setResponse("Activity Definition Records Deleted Successfully");
        } else {
            //Update Non-Draft Version with Soft Delete
            int updated = activityDefinitionVersionCustomRepo.updateActivityDefinitionVersion(Status.DELETE, Status.DRAFT, activityDefnOptional.get().getActivityDefnKey());
            //Hard Delete Draft Version with Soft Delete
            int deleted = activityDefinitionVersionCustomRepo.deleteByActivityDefnKeyAndStatus(activityDefnOptional.get().getActivityDefnKey(), Status.DRAFT.getStatus());

            activityDefnOptional.get().setIsDeleted(Boolean.TRUE);
            activityDefnRepo.save(activityDefnOptional.get());

            response.setResponse("Activity Definition Records Deleted Successfully");
        }
        return response;
    }

    private SponsorInfo validateSponsorContext(String sponsorContext) throws ResourceNotFoundException {
        SponsorInfo sponsorInfo = TenantContext.getTenantContext();
        if (Objects.isNull(sponsorInfo)) {
            throw new ResourceNotFoundException("sponsorContext", "SponsorIssue", "Sponsor '" + sponsorContext + "' not found. Kindly check the sponsorContext.");
        }
        log.info("sponsorkey : " + sponsorInfo.getSponsorKey());
        return sponsorInfo;
    }

    private List<String> getStatusListOfString(List<String> status) throws Exception {
        if (status == null || status.isEmpty()) {
            status = Stream.of(Status.values())
                    .map(Enum::name)
                    .collect(Collectors.toList());
        }
        if(StatusEnumValidator.validateStatuses(status).size() != status.size()){
            throw new InvalidStatusException("InvalidStatus","The provided status is not valid. Please verify the status.");
        }
        log.info("Status selected : {}", status);
        return status;
    }
}
