package com.precisely.pem.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.precisely.pem.dtos.requests.ActivityInstReq;
import com.precisely.pem.dtos.responses.ActivityInstListResp;
import com.precisely.pem.dtos.responses.ActivityInstPagnResp;
import com.precisely.pem.dtos.responses.ActivityInstResp;
import com.precisely.pem.dtos.responses.ActivityInstStatsResp;
import com.precisely.pem.exceptionhandler.InvalidStatusException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import org.json.JSONException;

import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.sql.SQLException;

public interface ActivityInstService {
    ActivityInstResp createActivityInstance(String sponsorContext, ActivityInstReq activityInstReq) throws ResourceNotFoundException, SQLException, JsonProcessingException, JSONException, InvalidStatusException;

    ActivityInstListResp getInstanceByKey(String sponsorContext, String activityInstKey) throws ResourceNotFoundException;

    ActivityInstPagnResp getAllInstanceList(String sponsorContext, String name, String description, String instStatus, String activityDefnVersionKey, String partnerKey, Boolean activityStats, int pageNo, int pageSize, String s, String s1) throws ResourceNotFoundException;

    ActivityInstStatsResp getActivityInstStatsByKey(String sponsorContext, String activityInstKey) throws ResourceNotFoundException, IOException, SQLException;
}
