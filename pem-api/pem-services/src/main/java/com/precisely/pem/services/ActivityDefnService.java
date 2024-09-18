package com.precisely.pem.services;


import com.precisely.pem.dtos.requests.ActivityDefnReq;
import com.precisely.pem.dtos.requests.UpdateActivityReq;
import com.precisely.pem.dtos.responses.ActivityDefnListResp;
import com.precisely.pem.dtos.responses.ActivityDefnPaginationRes;
import com.precisely.pem.dtos.responses.ActivityDefnResp;
import com.precisely.pem.dtos.responses.MessageResp;
import com.precisely.pem.exceptionhandler.BpmnConverterException;
import com.precisely.pem.exceptionhandler.DuplicateEntryException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.exceptionhandler.SchemaValidationException;

import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public interface ActivityDefnService {
    ActivityDefnPaginationRes getAllDefinitionList(String sponsorContext, String name, String description,
                                                   String application, List<String> status, int pageNo, int pageSize,
                                                   String sortBy, String sortDir) throws Exception;
    ActivityDefnResp createActivityDefinition(String sponsorContext, ActivityDefnReq activityDefnReq) throws IOException, SQLException, DuplicateEntryException, ResourceNotFoundException, BpmnConverterException, SchemaValidationException, XMLStreamException;
    ActivityDefnListResp getActivityDefinitionByKey(String sponsorContext, String activityDefnKey) throws Exception;
    MessageResp updateActivityDefinitionByKey(String sponsorContext, String activityDefnKey, UpdateActivityReq updateActivityReq) throws Exception;
    MessageResp deleteActivityDefinitionByKey(String sponsorContext, String activityDefnKey) throws Exception;
}