package com.precisely.pem.controller;

import com.precisely.pem.commonUtil.PaginationRequest;
import com.precisely.pem.enums.RoleSortBy;
import com.precisely.pem.enums.SortDirection;
import com.precisely.pem.enums.UserSortBy;
import com.precisely.pem.dtos.requests.UserRequest;
import com.precisely.pem.dtos.responses.SponsorInfo;
import com.precisely.pem.dtos.responses.UserPaginationResponse;
import com.precisely.pem.dtos.shared.TenantContext;
import com.precisely.pem.exceptionhandler.ErrorResponseDto;
import com.precisely.pem.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@Tag(name = "User", description = "User APIs")
@RequestMapping("/sponsors/{sponsorContext}/v2/users")
@RestController
@Log4j2
public class UserController {

    @Autowired
    UserService userService;

    @Operation(summary = "Get Users")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = UserPaginationResponse.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = UserPaginationResponse.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Exception in getting the User Roles", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "500", description = "System Exception in getting the User Roles", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}), })
    @GetMapping(value = "" , produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<UserPaginationResponse> getUserRoles(
            @RequestParam(value = "partnerKey", required = false) String partnerKey,
            @RequestParam(value = "userKey", required = false) String userKey,
            @RequestParam(value = "userName", required = false) String userName,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "userExternalId", required = false) String userExternalId,
            @RequestParam(value = "participantRole", required = false) String participantRole,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "modifyTs" ,required = false) UserSortBy sortBy,
            @RequestParam(value = "sortDir", defaultValue = "DESC", required = false) SortDirection sortDir,
            @PathVariable(value = "sponsorContext") String sponsorContext) throws Exception {
        SponsorInfo sponsorInfo = TenantContext.getTenantContext();
        UserPaginationResponse userList = userService.findUsers(UserRequest.builder()
                .sponsorKey(sponsorInfo.getSponsorKey())
                        .partnerKey(partnerKey)
                        .userKey(userKey)
                        .userName(userName)
                        .firstName(firstName)
                        .lastName(lastName)
                        .email(email)
                        .participantRole(participantRole)
                        .userExternalId(userExternalId)
                        .participantStatus(status)
                        .build(),
                PaginationRequest.builder()
                    .pageNo(pageNo)
                    .pageSize(pageSize)
                    .sortBy(Objects.isNull(sortBy) ? RoleSortBy.modifyTs.getName() : sortBy.getName())
                    .sortDir(Objects.isNull(sortDir) ? SortDirection.DESC.getSort_direction() : sortDir.name())
                    .build());
        return  new ResponseEntity<>(userList, HttpStatus.OK);
    }
}
