package com.precisely.pem.controller;

import com.precisely.pem.commonUtil.PaginationRequest;
import com.precisely.pem.enums.RoleSortBy;
import com.precisely.pem.enums.SortDirection;
import com.precisely.pem.dtos.responses.GetUserRoleResponse;
import com.precisely.pem.exceptionhandler.ErrorResponseDto;
import com.precisely.pem.services.RoleService;
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

@Tag(name = "Role", description = "User Role APIs")
@RequestMapping("/sponsors/{sponsorContext}/v2/roles")
@RestController
@Log4j2
public class RoleController {

    @Autowired
    RoleService roleService;


    @Operation(summary = "Get User Roles")
    @ApiResponses({
            @ApiResponse(responseCode = "200", content = {
                    @Content(schema = @Schema(implementation = GetUserRoleResponse.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = GetUserRoleResponse.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "400", description = "Exception in getting the User Roles", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}),
            @ApiResponse(responseCode = "500", description = "System Exception in getting the User Roles", content = {
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_JSON_VALUE),
                    @Content(schema = @Schema(implementation = ErrorResponseDto.class), mediaType = MediaType.APPLICATION_XML_VALUE)}), })
    @GetMapping(value = "" , produces = {MediaType.APPLICATION_JSON_VALUE,MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<GetUserRoleResponse> getUserRoles(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "modifyTs" ,required = false) RoleSortBy sortBy,
            @RequestParam(value = "sortDir", defaultValue = "DESC", required = false) SortDirection sortDir,
            @PathVariable(value = "sponsorContext") String sponsorContext) throws Exception {
        return new ResponseEntity<>(roleService.getUserRoles(PaginationRequest.builder()
                .pageNo(pageNo)
                .pageSize(pageSize)
                .sortBy(Objects.isNull(sortBy) ? "modifyTs" : sortBy.getName())
                .sortDir(Objects.isNull(sortDir) ? "ASC" : sortDir.name())
                .build()), HttpStatus.OK);
    }
}
