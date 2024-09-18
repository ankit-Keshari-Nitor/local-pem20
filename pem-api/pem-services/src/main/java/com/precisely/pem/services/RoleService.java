package com.precisely.pem.services;

import com.precisely.pem.commonUtil.PaginationRequest;
import com.precisely.pem.dtos.responses.GetUserRoleResponse;

public interface RoleService {
    GetUserRoleResponse getUserRoles(PaginationRequest getUserRoleRequest);
}
