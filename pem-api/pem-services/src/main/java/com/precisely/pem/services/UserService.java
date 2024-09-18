package com.precisely.pem.services;

import com.precisely.pem.commonUtil.PaginationRequest;
import com.precisely.pem.dtos.requests.UserRequest;
import com.precisely.pem.dtos.responses.SponsorInfo;
import com.precisely.pem.dtos.responses.UserPaginationResponse;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;


public interface UserService {
    SponsorInfo getActiveSponsorNameBySponsorContext(String sponsorContext);
    UserPaginationResponse findUsers(UserRequest userRequest, PaginationRequest pageReq) throws ResourceNotFoundException;

}
