package com.precisely.pem.controller;

import com.precisely.pem.enums.VersionSortBy;
import com.precisely.pem.enums.SortDirection;
import com.precisely.pem.dtos.PemBpmnModel;
import com.precisely.pem.dtos.requests.ActivityVersionReq;
import com.precisely.pem.dtos.requests.UpdateActivityVersionReq;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.dtos.responses.ActivityDefnVersionResp;
import com.precisely.pem.dtos.responses.ActivityVersionDefnPaginationResp;
import com.precisely.pem.dtos.responses.BaseResourceResp;
import com.precisely.pem.exceptionhandler.*;
import com.precisely.pem.services.ActivityVersionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.extern.log4j.Log4j2;
import org.apache.logging.log4j.Level;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Objects;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Tag(name = "Activity Definition Version", description = "Activity Definition Version Management APIs")
@RequestMapping("/sponsors/{sponsorContext}/v2/activityDefinitions/{activityDefnKey}/versions")
@RestController
@Log4j2
public class ActivityVersionController {

    @Autowired
    ActivityVersionService activityVersionService;

    @Operation(summary = "Retrieve all Versions of Activity Definition", tags = { "Activity Definition Version" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ActivityVersionDefnPaginationResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityVersionDefnPaginationResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "204", description = "There are no Versions for Definitions", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
    })
    @GetMapping()
    public ResponseEntity<Object> getActivityVersionDefinitionList(@PathVariable(value = "activityDefnKey") String activityDefnKey,
                                                                   @RequestParam(value = "isDefault",required = false) Boolean isDefault,
                                                                   @RequestParam(value = "description", required = false) @Size(min = 1, max = 255) String description,
                                                                   @RequestParam(value = "status", required = false) List<String> status,
                                                                   @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                                   @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
                                                                   @RequestParam(value = "sortBy", defaultValue = "modifyTs" ,required = false) VersionSortBy sortBy,
                                                                   @RequestParam(value = "sortDir", defaultValue = "DESC", required = false) SortDirection sortDir,
                                                                   @PathVariable(value = "sponsorContext")String sponsorContext) throws Exception {
        return new ResponseEntity<>(activityVersionService.getAllVersionDefinitionList(sponsorContext,activityDefnKey,description,isDefault,pageNo, pageSize, sortBy.name(), sortDir ==null? "ASC":sortDir.name(), status),HttpStatus.OK);
    }

    @Operation(summary = "Get Version of Activity Definition", tags = { "Activity Definition Version" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ActivityDefnVersionResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityDefnVersionResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "204", description = "There are no Versions for Definitions", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
    })
    @GetMapping("/{activityDefnVersionKey}")
    public ResponseEntity<Object> getActivityVersionDefinitionById(@PathVariable(value = "activityDefnKey", required = true) String activityDefnKey,
                                                                   @PathVariable(value = "activityDefnVersionKey", required = true) String activityDefnVersionKey,
                                                                   @PathVariable(value = "sponsorContext", required = true)String sponsorContext) throws Exception {
        return new ResponseEntity<>(activityVersionService.getVersionDefinitionByKey(activityDefnKey,sponsorContext,activityDefnVersionKey), HttpStatus.OK);
    }

    @Operation(summary = "Create an Activity Definition Version")
    @ApiResponses({
            @ApiResponse(responseCode = "201", content = {
                    @Content(schema = @Schema(implementation = ActivityDefnVersionResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityDefnVersionResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "400", description = "Exception in creating a version for given Activity Definition", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> createActivityDefinitionVersion(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                                  @PathVariable(value = "activityDefnKey")String activityDefnKey,
                                                                  @Valid ActivityVersionReq activityVersionReq
    ) throws SQLException, IOException, OnlyOneDraftVersionException, ResourceNotFoundException, AlreadyDeletedException, BpmnConverterException, SchemaValidationException, XMLStreamException {
        ActivityDefnVersionResp activityDefnVersionResp = activityVersionService.createActivityDefnVersion(sponsorContext, activityDefnKey, activityVersionReq);
        Link link = linkTo(methodOn(ActivityVersionController.class).createActivityDefinitionVersion(sponsorContext, activityDefnKey, activityVersionReq)).withSelfRel();
        activityDefnVersionResp.setLocation(link.getHref());
        HttpHeaders headers = new HttpHeaders();
        headers.set("location", activityDefnVersionResp.getLocation());
        return new ResponseEntity<>(activityDefnVersionResp, headers, HttpStatus.CREATED);
    }

    @Operation(summary = "Mark Activity Definition Version Status as Final", tags = { "Activity Definition Version" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = BaseResourceResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = BaseResourceResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "400", description = "Activity Definition not found", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
    })
    @PostMapping("/{activityDefnVersionKey}/actions/markAsFinal")
    public ResponseEntity<Object> markActivityDefinitionStatusAsFinal(@PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "activityDefnKey")String activityDefnKey, @PathVariable(value = "activityDefnVersionKey")String activityDefnVersionKey) throws Exception {
        if(log.isEnabled(Level.INFO))
            log.info("Mark Activity Definition Version Status: Starts");
        return  new ResponseEntity<>(activityVersionService.markAsFinalActivityDefinitionVersion(activityDefnVersionKey), HttpStatus.OK);
    }


    @Operation(summary = "Update Activity Definition Version", tags = { "Activity Definition Version" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = MessageResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = MessageResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "400", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
    })
    @PostMapping( value = "/{activityDefnVersionKey}" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
    public ResponseEntity<Object> updateActivityDefinitionVersion(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                                      @PathVariable(value = "activityDefnKey")String activityDefnKey,
                                                                      @PathVariable(value = "activityDefnVersionKey")String activityDefnVersionKey,
                                                                      @ModelAttribute @Valid UpdateActivityVersionReq updateActivityVersionReq) throws Exception {
        if(log.isEnabled(Level.INFO))
            log.info("Update Activity Definition Version: Starts");
        return  new ResponseEntity<>(activityVersionService.updateActivityDefnVersion(sponsorContext,activityDefnKey,activityDefnVersionKey,updateActivityVersionReq), HttpStatus.OK);
    }

    @Operation(summary = "Mark Activity Definition Version Status as Default", tags = { "Activity Definition Version" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = BaseResourceResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = BaseResourceResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "400", description = "Activity Definition not found", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
    })
    @PostMapping("/{activityDefnVersionKey}/actions/markAsDefault")
    public ResponseEntity<Object> markActivityDefinitionStatusAsDefault(@PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "activityDefnKey")String activityDefnKey, @PathVariable(value = "activityDefnVersionKey")String activityDefnVersionKey) throws Exception {
        if(log.isEnabled(Level.INFO))
            log.info("Retrieve all Activity Definitions: Starts");
        return  new ResponseEntity<>(activityVersionService.markAsDefaultActivityDefinitionVersion(sponsorContext,activityDefnKey,activityDefnVersionKey), HttpStatus.OK);
    }

    @Operation(summary = "Get Activity Definition Data for Specific Version of Activity Definition", tags = { "Activity Definition Version" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = PemBpmnModel.class), mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Activity Definition not found", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE) }),
    })
    @GetMapping("/{activityDefnVersionKey}/actions/getData")
    public ResponseEntity<InputStreamResource> getActivityDataForSpecificVersion( @PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "activityDefnKey")String activityDefnKey, @PathVariable(value = "activityDefnVersionKey")String activityDefnVersionKey) throws Exception {
        if(log.isEnabled(Level.INFO))
            log.info("getActivityDataForSpecificVersion: Starts");
        ActivityDataResponse activityDataResponse = activityVersionService.getActivityDataForSpecificVersion(sponsorContext,activityDefnKey,activityDefnVersionKey);
        return  ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + activityDataResponse.getFileName() + "\"")
                .body(activityDataResponse.getStreamResource());
    }

    @Operation(summary = "Get Activity Definition Context Data for Specific Version of Activity Definition", tags = { "Activity Definition Version" })
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = Object.class), mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Activity Definition not found", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE)}),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE) }),
    })
    @GetMapping("/{activityDefnVersionKey}/actions/getContextData")
    public ResponseEntity<Object> getActivityDefinitionContextData( @PathVariable(value = "sponsorContext")String sponsorContext, @PathVariable(value = "activityDefnKey")String activityDefnKey, @PathVariable(value = "activityDefnVersionKey")String activityDefnVersionKey) throws Exception {
        if(log.isEnabled(Level.INFO))
            log.info("getActivityDefinitionContextData: Starts");
        Object activityContextData = activityVersionService.getActivityDefinitionContextData(activityDefnVersionKey);
        return  ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Objects.isNull(activityContextData) ? "" : activityContextData);
    }
}
