package com.precisely.pem.services;

import com.precisely.pem.dtos.requests.ProcessDataEvaluation;
import com.precisely.pem.dtos.requests.SetOwnerRequest;
import com.precisely.pem.dtos.responses.*;
import com.precisely.pem.enums.SortDirection;
import com.precisely.pem.dtos.shared.ActivityTaskDto;
import com.precisely.pem.exceptionhandler.InvalidStatusException;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;

import java.util.List;

import java.util.Map;

public interface ParticipantActivityInstService {
    ParticipantActivityInstPaginationResp getAllParticipantActivityInstances(String sponsorContext,String status,String activityInstKey,String activityDefnVersionKey,Boolean activityStats,
                                                                                      String currentTask,String partnerName, String progress,
                                                                                      int pageNo, int pageSize, String sortDir) throws Exception;
    ParticipantActivityInstResp getParticipantActivityInstanceByKey(String sponsorContext, String pcptActivityInstKey) throws Exception;
    MessageResp startActivity(String sponsorContext, String pcptActivityInstKey) throws ResourceNotFoundException, InvalidStatusException;
    ActivityTaskDto getNodeDetails(String sponsorContext, String pcptActivityInstKey, String taskKey) throws Exception;

    ProcessEvaluationResponse evaluatePaths(String pcptActivityInstKey, ProcessDataEvaluation jsonPath) throws Exception;
    BaseResourceResp completeNode(String sponsorContext, String pcptActivityInstKey, String taskKey, String data, Boolean isDraft) throws Exception;
    BaseResourceResp setOwner(String sponsorContext, String pcptActivityInstKey, String taskKey, SetOwnerRequest ownerRequest) throws ResourceNotFoundException;
    TasksListPaginationResp getListofTasks(String sponsorContext, String pcptActivityInstKey, List<String> taskType, List<String> status, int pageNo, int pageSize, SortDirection sortDir) throws Exception;

    Map<String, Object> getProcessStatus(String sponsorContext, String pcptActivityInstKey, String userRole) throws Exception;
}
