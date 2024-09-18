package com.precisely.pem.controller;

import com.precisely.pem.enums.Application;
import com.precisely.pem.enums.DefinitionSortBy;
import com.precisely.pem.enums.SortDirection;
import com.precisely.pem.dtos.requests.ActivityDefnReq;
import com.precisely.pem.dtos.requests.UpdateActivityReq;
import com.precisely.pem.dtos.responses.ActivityDefnListResp;
import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.ActivityDefnResp;
import com.precisely.pem.dtos.responses.MessageResp;
import com.precisely.pem.exceptionhandler.ErrorResponseDto;
import com.precisely.pem.services.ActivityDefnService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Tag(name = "Activity Definition", description = "Activity Definition management APIs")
@RequestMapping("/sponsors/{sponsorContext}/v2/activityDefinitions")
@RestController
@Log4j2
public class ActivityController {

    @Autowired
    ActivityDefnService activityDefnService;

    @Operation(summary = "Create an Activity Definition")
    @ApiResponses({
            @ApiResponse(responseCode = "201", content = {
                    @Content(schema = @Schema(implementation = ActivityDefnResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityDefnResp.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Exception in creating an Activity Definition", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)})
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Object> createActivityDefinition(@Valid ActivityDefnReq activityDefnReq,
                                                           @PathVariable(value = "sponsorContext", required = true) String sponsorContext) throws Exception {
        ActivityDefnResp activityDefnResp = activityDefnService.createActivityDefinition(sponsorContext, activityDefnReq);
        Link link = linkTo(methodOn(ActivityController.class).getActivityDefinitionByKey(sponsorContext,activityDefnResp.getActivityDefnKey())).withSelfRel();
        activityDefnResp.setLocation(link.getHref());
        HttpHeaders headers = new HttpHeaders();
        headers.set("location", activityDefnResp.getLocation());
        return new ResponseEntity<>(activityDefnResp, headers, HttpStatus.CREATED);
    }

    @Operation(summary = "Retrieve all Activity Definitions", tags = { "Activity Definition" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ActivityDefnPaginationRes.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityDefnPaginationRes.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "404", description = "There are no Definitions", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) })
    })
    @GetMapping(produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Object> getActivityDefinitionList(@RequestParam(value = "name", required = false) String name,
                                                            @RequestParam(value = "description", required = false) String description,
                                                            @RequestParam(value = "status", required = false) List<String> status,
                                                            @RequestParam(value = "application", defaultValue = "PEM", required = true) Application application,
                                                            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
                                                            @RequestParam(value = "sortBy", defaultValue = "modifyTs" ,required = false) DefinitionSortBy definitionSortBy,
                                                            @RequestParam(value = "sortDir", defaultValue = "DESC", required = false) SortDirection sortDir,
                                                            @PathVariable(value = "sponsorContext")String sponsorContext) throws Exception {
        ActivityDefnPaginationRes activityDefnPaginationRes = activityDefnService.getAllDefinitionList(sponsorContext,name,description,application.getApp(),status,pageNo, pageSize, definitionSortBy ==null? "modifyTs": definitionSortBy.name(), sortDir ==null? "ASC":sortDir.name());
        if (activityDefnPaginationRes.getContent() == null || activityDefnPaginationRes.getContent().isEmpty()) {
            return new ResponseEntity<>(new ActivityDefnPaginationRes(), HttpStatus.OK);
        } else {
            activityDefnPaginationRes.getContent().stream()
                    .map(p ->
                    {
                        Link link = null;
                        try {
                            link = linkTo(methodOn(ActivityController.class).getActivityDefinitionByKey(sponsorContext, p.getActivityDefnKey())).withSelfRel();
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                        p.setActivityVersionLink(link.getHref());
                        return p;
                    }).collect(Collectors.toList());
        }
        return new ResponseEntity<>(activityDefnPaginationRes, HttpStatus.OK);
    }

    @Operation(summary = "Get Activity Definition by Key", tags = { "Activity Definition" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ActivityDefnListResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityDefnListResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "404", description = "Activity Definition not found", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) })
    })
    @GetMapping (value="/{activityDefnKey}", produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Object> getActivityDefinitionByKey(@PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "activityDefnKey")String activityDefnKey) throws Exception {
        ActivityDefnListResp activityDefnListResp = activityDefnService.getActivityDefinitionByKey(sponsorContext, activityDefnKey);
        Link link = linkTo(methodOn(ActivityController.class).getActivityDefinitionByKey(sponsorContext,activityDefnKey)).withSelfRel();
        activityDefnListResp.setActivityVersionLink(link.getHref());
        return new ResponseEntity<>(activityDefnListResp,HttpStatus.OK);
    }

    @Operation(summary = "Update Activity Definition by Key", tags = { "Activity Definition" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = MessageResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = MessageResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "400", description = "Exception in updating the Activity Definition", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "404", description = "Activity Definition not found", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)})
    })
    @PostMapping (value = "/{activityDefnKey}",consumes = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Object> updateActivityDefinitionByKey(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                                @PathVariable(value = "activityDefnKey")String activityDefnKey,
                                                                @RequestBody @Valid UpdateActivityReq updateActivityReq) throws Exception {
        return new ResponseEntity<>(activityDefnService.updateActivityDefinitionByKey(sponsorContext,activityDefnKey,updateActivityReq),HttpStatus.OK);
    }


    @Operation(summary = "Delete Activity Definition by Key", tags = { "Activity Definition" })
    @ApiResponses({
            @ApiResponse(responseCode = "200"),
            @ApiResponse(responseCode = "404", description = "Activity Definition not found", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE) }),
            @ApiResponse(responseCode = "500", content = { @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE) }) })
    @DeleteMapping(value = "/{activityDefnKey}" , produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Object> deleteActivityDefinitionByKey(@PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "activityDefnKey")String activityDefnKey) throws Exception {
        return  new ResponseEntity<>(activityDefnService.deleteActivityDefinitionByKey(sponsorContext, activityDefnKey), HttpStatus.OK);
    }
}
