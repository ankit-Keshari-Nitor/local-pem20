package com.precisely.pem.controller;

import com.precisely.pem.enums.InstStatus;
import com.precisely.pem.enums.InstanceSortBy;
import com.precisely.pem.enums.SortDirection;
import com.precisely.pem.dtos.requests.ActivityInstReq;
import com.precisely.pem.dtos.responses.ActivityInstListResp;
import com.precisely.pem.dtos.responses.ActivityInstPagnResp;
import com.precisely.pem.dtos.responses.ActivityInstResp;
import com.precisely.pem.dtos.responses.ActivityInstStatsResp;
import com.precisely.pem.dtos.shared.ActivityStatsDto;
import com.precisely.pem.exceptionhandler.ErrorResponseDto;
import com.precisely.pem.services.ActivityInstService;
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

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Tag(name = "Activity Instances", description = "Activity Instance management APIs")
@RequestMapping("/sponsors/{sponsorContext}/v2/activityInstances")
@RestController
@Log4j2
public class ActivityInstanceController {

    @Autowired
    ActivityInstService activityInstService;

    @Operation(summary = "Create an Activity Instance")
    @ApiResponses({
            @ApiResponse(responseCode = "201", content = {
                    @Content(schema = @Schema(implementation = ActivityInstResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityInstResp.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Exception in creating an Activity Instance", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)})
    })
    @PostMapping
    public ResponseEntity<Object> createActivityInstance(@Valid @RequestBody ActivityInstReq activityInstReq,
                                                         @PathVariable(value = "sponsorContext", required = true) String sponsorContext) throws Exception {
        ActivityInstResp activityInstResp = activityInstService.createActivityInstance(sponsorContext,activityInstReq);
        Link link = linkTo(methodOn(ActivityInstanceController.class).getActivityInstanceByKey(sponsorContext,activityInstResp.getActivityInstKey())).withSelfRel();
        activityInstResp.setLocation(link.getHref());
        HttpHeaders headers = new HttpHeaders();
        headers.set("location", activityInstResp.getLocation());
        return new ResponseEntity<>(activityInstResp, headers, HttpStatus.CREATED);
    }

    @Operation(summary = "Get Activity Instance by Key")
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
    @GetMapping(value = "/{activityInstKey}",produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Object> getActivityInstanceByKey(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                                 @PathVariable(value = "activityInstKey")String activityInstKey) throws Exception {
        ActivityInstListResp activityInstResp = activityInstService.getInstanceByKey(sponsorContext,activityInstKey);
//        activityInstResp.setActivityTasks(null);//We will populate this data when we have the API in place.
//        activityInstResp.setPcptActivityInstances(null);//We will populate this data when we have the API in place.
        return new ResponseEntity<>(activityInstResp, HttpStatus.OK);
    }

    @Operation(summary = "Get List of Activity Instances")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ActivityInstPagnResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityInstPagnResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "404", description = "There are no Instances", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "500", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) })
    })
    @GetMapping(produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Object> getActivityInstanceList(@RequestParam(value = "name", defaultValue = "", required = false) String name,
                                                          @RequestParam(value = "description",defaultValue = "", required = false) String description,
                                                          @RequestParam(value = "status") InstStatus status,
                                                          @RequestParam(value = "activityDefnVersionKey") String activityDefnVersionKey,
                                                          @RequestParam(value = "partnerKey", defaultValue = "", required = false) String partnerKey,
                                                          @RequestParam(value = "activityStats", defaultValue = "false") Boolean activityStats,
                                                          @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
                                                          @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
                                                          @RequestParam(value = "instanceSortBy", defaultValue = "modifyTs" ,required = false) InstanceSortBy instanceSortBy,
                                                          @RequestParam(value = "sortDir", defaultValue = "DESC", required = false) SortDirection sortDir,
                                                          @PathVariable(value = "sponsorContext")String sponsorContext) throws Exception {
        ActivityInstPagnResp activityDefnPaginationRes = activityInstService.getAllInstanceList(sponsorContext,name,description,status.getInstStatus(),activityDefnVersionKey,partnerKey,activityStats,pageNo, pageSize, instanceSortBy ==null? "modify_ts": instanceSortBy.name(), sortDir ==null? "ASC":sortDir.name());
        //        logic will change when API will get introduced to generate these values

        ActivityStatsDto activityStatsDto = new ActivityStatsDto();
        activityStatsDto.setCompleted(0);
        activityStatsDto.setPartners(0);
        activityStatsDto.setStarted(0);
        activityStatsDto.setNotStarted(0);
        activityStatsDto.setSponsorAction(0);
//        logic will change when API will get introduced to generate these values

//        activityDefnPaginationRes.getContent().stream()
//                .map(p ->
//                {
////                    Link link = null;
////                    try {
////                        link = linkTo(methodOn(ActivityInstanceController.class).createActivityInstance(new ActivityInstReq(),sponsorContext)).withSelfRel();
////                    } catch (Exception e) {
////                        throw new RuntimeException(e);
////                    }
//                    p.setActivityTasks(null); //We will populate this data when we have the API in place.
//                    if(activityStats) {
//                        p.setActivityStats(activityStatsDto);
//                    }
//                    return p;
//                }).collect(Collectors.toList());

        return new ResponseEntity<>(activityDefnPaginationRes, HttpStatus.OK);
    }

    @Operation(summary = "Get Activity Instance Stats by Key")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = ActivityInstStatsResp.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ActivityInstStatsResp.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "404", description = "There are no Activity Instances", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) }),
            @ApiResponse(responseCode = "422", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE) })
    })
    @GetMapping(value = "/{activityInstKey}/actions/getStats",produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Object> getActivityInstStatsByKey(@PathVariable(value = "sponsorContext")String sponsorContext,
                                                            @PathVariable(value = "activityInstKey")String activityInstKey) throws Exception{
        ActivityInstStatsResp activityInstStatsResp = activityInstService.getActivityInstStatsByKey(sponsorContext,activityInstKey);
        return new ResponseEntity<>(activityInstStatsResp, HttpStatus.OK);

    }
}
