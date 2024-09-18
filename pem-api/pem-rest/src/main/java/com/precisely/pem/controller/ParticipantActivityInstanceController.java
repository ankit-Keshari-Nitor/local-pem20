package com.precisely.pem.controller;

import com.precisely.pem.enums.InstanceSortBy;
import com.precisely.pem.dtos.shared.ActivityTaskDto;
import com.precisely.pem.enums.PcptInstProgress;
import com.precisely.pem.enums.PcptInstStatus;
import com.precisely.pem.enums.SortDirection;
import com.precisely.pem.dtos.requests.ProcessDataEvaluation;
import com.precisely.pem.dtos.requests.SetOwnerRequest;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.exceptionhandler.ErrorResponseDto;
import com.precisely.pem.exceptionhandler.InvalidStatusException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.services.ParticipantActivityInstService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.apache.logging.log4j.Level;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import java.util.List;

@Tag(name = "Participant Activity Instances", description = "Participant Activity Instance management APIs")
@RequestMapping("/sponsors/{sponsorContext}/v2/pcptActivities")
@RestController
@Log4j2
public class ParticipantActivityInstanceController {

    @Autowired
    ParticipantActivityInstService participantActivityInstService;

    @Operation(summary = "Get List of Participant Activity Instances")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ParticipantActivityInstPaginationResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ParticipantActivityInstPaginationResp.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Exception in getting the list of Participant Activity Instances", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "404", description = "There are no Participant Activity Instances", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)})
    })
    @GetMapping(produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Object> getParticipantActivityInstance(@RequestParam(value = "status", defaultValue = "", required = false) PcptInstStatus status,
                                                                 @RequestParam(value = "activityInstKey",defaultValue = "", required = true) String activityInstKey,
                                                                 @RequestParam(value = "activityDefnVersionKey",defaultValue = "", required = true) String activityDefnVersionKey,
                                                                 @RequestParam(value = "activityStats", defaultValue = "false", required = false) Boolean activityStats,
                                                                 @RequestParam(value = "currentTask", defaultValue = "", required = false) String currentTask,
                                                                 @RequestParam(value = "partnerName", defaultValue = "", required = false) String partnerName,
                                                                 @RequestParam(value = "progress", defaultValue = "", required = false) PcptInstProgress progress,
                                                                 @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                                 @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
                                                                 @RequestParam(value = "sortDir", defaultValue = "DESC", required = false) SortDirection sortDir,
                                                                 @PathVariable("sponsorContext") String sponsorContext) throws Exception{
        ParticipantActivityInstPaginationResp participantActivityInstPaginationResp = participantActivityInstService.getAllParticipantActivityInstances(sponsorContext, status ==null? "":status.toString(),activityInstKey,activityDefnVersionKey,activityStats, currentTask,partnerName, progress == null? "":progress.toString(), pageNo, pageSize,sortDir ==null? "ASC":sortDir.name());
        /*participantActivityInstPaginationResp.getContent().stream()
                .map(p ->
                {
                    Link link = null;
                    try {
                        link = linkTo(methodOn(ParticipantActivityInstanceController.class).getListOfTasks(sponsorContext, p.getPcptActivityInstKey())).withSelfRel();
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                    p.setTasks(link.getHref());
                    return p;
                }).collect(Collectors.toList());*/ //Enable this once the Get list of tasks Api is implemented
        return new ResponseEntity<>(participantActivityInstPaginationResp, HttpStatus.OK);
    }

    @Operation(summary = "Get Participant Activity Instance by key")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ParticipantActivityInstResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ParticipantActivityInstResp.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Exception in getting the Participant Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "404", description = "There is no Participant Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)})
    })
    @GetMapping("/{pcptActivityInstKey}")
    public ResponseEntity<Object> getParticipantActivityInstanceByKey(@PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "pcptActivityInstKey")String pcptActivityInstKey) throws Exception{
        ParticipantActivityInstResp participantActivityInstResp = participantActivityInstService.getParticipantActivityInstanceByKey(sponsorContext,pcptActivityInstKey);
        /*Link link = linkTo(methodOn(ParticipantActivityInstanceController.class).getListOfTasks(sponsorContext, pcptActivityInstKey)).withSelfRel();
        participantActivityInstResp.setTasks(link.getHref());*/ //Enable this once the Get list of tasks Api is implemented
        return new ResponseEntity<>(participantActivityInstResp,HttpStatus.OK);

    }

    @Operation(summary = "Start/Execute Activity")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ActivityInstListResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityInstListResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "404", description = "There are no Instances", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) })
    })
    @PostMapping(value = "/{pcptActivityInstKey}/actions/start",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> startActivity(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                @PathVariable(value = "pcptActivityInstKey")String pcptActivityInstKey ) throws ResourceNotFoundException, InvalidStatusException {
        MessageResp messageResp = participantActivityInstService.startActivity(sponsorContext,pcptActivityInstKey);
        return new ResponseEntity<>(messageResp, HttpStatus.OK);
    }

    @Operation(summary = "Get Task details for specific task [DO NOT USE]")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ActivityTaskDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityTaskDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Exception in getting the Participant Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "404", description = "There is no Participant Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)})
    })
    @GetMapping("/{pcptActivityInstKey}/tasks/{taskKey}")
    public ResponseEntity<ActivityTaskDto> getTaskDetails(@PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "pcptActivityInstKey")String pcptActivityInstKey, @PathVariable(value = "taskKey")String taskKey) throws Exception{
        ActivityTaskDto ActivitytaskDTO = participantActivityInstService.getNodeDetails(sponsorContext,pcptActivityInstKey,taskKey);
        return new ResponseEntity<>(ActivitytaskDTO,HttpStatus.OK);

    }

    @Operation(summary = "Submit/Resume activity for form node [DO NOT USE]")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ParticipantActivityInstResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ParticipantActivityInstResp.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Exception in getting the Participant Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "404", description = "There is no Participant Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)})
    })
    @PostMapping("/{pcptActivityInstKey}/tasks/{taskKey}/actions/submit")
    public ResponseEntity<BaseResourceResp> submitTask(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                       @PathVariable(value = "pcptActivityInstKey")String pcptActivityInstKey,
                                                       @PathVariable(value = "taskKey")String taskKey, @RequestBody String data) throws Exception{
        // TODO : Do we required this api?
        //MarkAsFinalActivityDefinitionVersionResp markAsFinalActivityDefinitionVersionResp = participantActivityInstService.completeNode(sponsorContext,pcptActivityInstKey,taskKey,data);
        return new ResponseEntity<>(null,HttpStatus.OK);

    }

    @Operation(summary = "Get Node details for specific Node")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ActivityTaskDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityTaskDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Exception in getting the Participant Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "404", description = "There is no Participant Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)})
    })
    @GetMapping("/{pcptActivityInstKey}/nodes/{nodeKey}")
    public ResponseEntity<ActivityTaskDto> getNodeDetails(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                          @PathVariable(value = "pcptActivityInstKey")String pcptActivityInstKey,
                                                          @PathVariable(value = "nodeKey")String nodeKey) throws Exception{
        ActivityTaskDto ActivitytaskDTO = participantActivityInstService.getNodeDetails(sponsorContext,pcptActivityInstKey,nodeKey);
        return new ResponseEntity<>(ActivitytaskDTO,HttpStatus.OK);

    }

    @Operation(summary = "Submit activity for form node")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ParticipantActivityInstResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ParticipantActivityInstResp.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Exception in getting the Participant Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "404", description = "There is no Participant Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)})
    })

    @PostMapping("/{pcptActivityInstKey}/nodes/{nodeKey}/actions/submit")
    public ResponseEntity<BaseResourceResp> submitNode(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                       @PathVariable(value = "pcptActivityInstKey")String pcptActivityInstKey,
                                                       @PathVariable(value = "nodeKey")String nodeKey, @RequestBody String data) throws Exception{
        BaseResourceResp baseResourceResp = participantActivityInstService.completeNode(sponsorContext,pcptActivityInstKey,nodeKey,data,false);
        return new ResponseEntity<>(baseResourceResp,HttpStatus.OK);

    }

    @Operation(summary = "Save activity for form node")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ParticipantActivityInstResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ParticipantActivityInstResp.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Exception in getting the Participant Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "404", description = "There is no Participant Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)})
    })

    @PutMapping("/{pcptActivityInstKey}/nodes/{nodeKey}")
    public ResponseEntity<BaseResourceResp> saveNode(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                     @PathVariable(value = "pcptActivityInstKey")String pcptActivityInstKey,
                                                     @PathVariable(value = "nodeKey")String nodeKey, @RequestBody String data) throws Exception{
        BaseResourceResp baseResourceResp = participantActivityInstService.completeNode(sponsorContext,pcptActivityInstKey,nodeKey,data,true);
        return new ResponseEntity<>(baseResourceResp,HttpStatus.OK);

    }

    @Operation(summary = "Evaluate Path from Pcpt Activity Instance Context Data")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ProcessEvaluationResponse.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ProcessEvaluationResponse.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Pcpt Activity Instance not found", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
    })
    @PostMapping( value = "/{pcptActivityInstKey}/actions/evaluatePaths" ,consumes = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<ProcessEvaluationResponse> evaluatePaths(@PathVariable(value = "sponsorContext")String sponsorContext, @RequestBody ProcessDataEvaluation jsonPath, @PathVariable(value = "pcptActivityInstKey")String pcptActivityInstKey) throws Exception {
        if(log.isEnabled(Level.INFO))
            log.info("evaluatePaths: Starts");
        ProcessEvaluationResponse activityContextData = participantActivityInstService.evaluatePaths(pcptActivityInstKey,jsonPath);
        return  ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(activityContextData);
    }

    @Operation(summary = "Get List of Tasks for PCPT Instances")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = TasksListPaginationResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = TasksListPaginationResp.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "404", description = "Pcpt Activity Instance not found", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
    })
    @GetMapping( value = "/{pcptActivityInstKey}/tasks")
    public ResponseEntity<Object> getListOfTasks(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                 @PathVariable(value = "pcptActivityInstKey")String pcptActivityInstKey,
                                                 @RequestParam(value = "taskType", required = false) List<String> taskType,
                                                 @RequestParam(value = "status", required = false) List<String> status,
                                                 @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                 @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
                                                 @RequestParam(value = "sortDir", defaultValue = "DESC", required = false) SortDirection sortDir) throws Exception{
        TasksListPaginationResp tasksListPaginationResp = participantActivityInstService.getListofTasks(sponsorContext,pcptActivityInstKey,taskType,status,pageNo,pageSize,sortDir);
        return new ResponseEntity<>(tasksListPaginationResp,HttpStatus.OK);
    }

    @Operation(summary = "Assign Owner")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = BaseResourceResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = BaseResourceResp.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Pcpt Activity Instance not found", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
    })
    @PostMapping( value = "/{pcptActivityInstKey}/tasks/{taskKey}/actions/setOwner" ,consumes = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<BaseResourceResp> assignOwner(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                        @RequestBody @Valid SetOwnerRequest ownerRequest,
                                                        @PathVariable(value = "pcptActivityInstKey")String pcptActivityInstKey, @PathVariable(value = "taskKey") String taskKey) throws Exception {
        if(log.isEnabled(Level.INFO))
            log.info("assignOwner: Starts");
        BaseResourceResp resp = participantActivityInstService.setOwner(sponsorContext,pcptActivityInstKey,taskKey,ownerRequest);
        return  ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(resp);
    }

    @Operation(summary = "Find Status for process")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ParticipantActivityInstResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ParticipantActivityInstResp.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Exception in getting the Participant Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "404", description = "There is no Participant Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)})
    })
    @GetMapping("/{pcptActivityInstKey}/actions/getStatus")
    public ResponseEntity<Map<String, Object>> getProcessStatus(@PathVariable(value = "sponsorContext") String sponsorContext, @PathVariable(value = "pcptActivityInstKey") String pcptActivityInstKey) throws Exception {
        String userRole = "PARTNER";
        Map<String, Object> data = participantActivityInstService.getProcessStatus(sponsorContext, pcptActivityInstKey, userRole);
        return new ResponseEntity<>(data, HttpStatus.OK);
    }
}
