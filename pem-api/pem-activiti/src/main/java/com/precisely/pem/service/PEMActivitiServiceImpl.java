package com.precisely.pem.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.precisely.pem.commonUtil.ApplicationConstants;
import com.precisely.pem.config.PEMUserDetailsService;
import com.precisely.pem.converter.AbstractNodeHandler;
import com.precisely.pem.dtos.Constants;
import com.precisely.pem.dtos.Node;
import com.precisely.pem.dtos.PemBpmnModel;
import com.precisely.pem.dtos.task.TaskDTO;
import lombok.extern.log4j.Log4j2;
import org.activiti.api.task.model.Task;
import org.activiti.api.task.runtime.TaskRuntime;
import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.*;
import org.activiti.engine.*;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.history.HistoricActivityInstanceQuery;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.impl.persistence.entity.ExecutionEntityImpl;
import org.activiti.engine.impl.util.io.InputStreamSource;
import org.activiti.engine.impl.util.json.JSONObject;
import org.activiti.engine.runtime.Execution;
import org.activiti.engine.runtime.Job;
import org.activiti.engine.runtime.ProcessInstance;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;


@Service
@DependsOn("processEngineConfiguration")
@Log4j2
public class PEMActivitiServiceImpl implements PEMActivitiService {

    @Autowired
    private RuntimeService runtimeService;

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private TaskService taskService;

    @Autowired
    private TaskRuntime taskRuntime;

    @Autowired
    private RepositoryService repositoryService;


    @Autowired
    private HistoryService historyService;

    @Autowired
    private ProcessEngine processEngine;


    @Autowired
    PEMUserDetailsService pemUserDetailsService;

    @Override
    public ProcessInstance startProcessInstanceByKey(String processDefinitionKey) {
        return runtimeService.startProcessInstanceByKey(processDefinitionKey);
    }


    @Override
    public String startProcessInstanceByKey(String processDefinitionKey, Map<String, Object> variables) {
        return runtimeService.startProcessInstanceByKey(processDefinitionKey, variables).getProcessInstanceId();
    }

    @Override
    public String startProcessInstanceById(String processDefinitionId) {
        log.debug("starting Process Instance By Definition Id : " + processDefinitionId);
        String id = runtimeService.startProcessInstanceById(processDefinitionId).getProcessInstanceId();
        log.debug("started Process Instance Id : " + id);
        return id;
    }

    @Override
    public String startProcessInstanceById(String processDefinitionId, String businessKey, Map<String, Object> variables) {
        log.debug("starting Process Instance By Definition Id : " + processDefinitionId);
        String id = runtimeService.startProcessInstanceById(processDefinitionId, businessKey, variables).getProcessInstanceId();
        log.debug("started Process Instance Id : " + id);
        return id;
    }

    @Override
    public void completeUserNode(String taskId, String input) throws Exception {
        try {
            // TODO: We have not integrated authentication in application,
            //  Problem : We can not read task details without Auth
            //  Error: Unauthorized.
            //  Response if task not found for given user : Unable to find task for the given id: TaskId for user: user1 (with groups: [] & with roles: [USER]),

            // TODO : Temp code to fix above problem
            UserDetails userDetails = pemUserDetailsService.loadUserByUsername("user1");
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Read task details
            Task task = (Task) taskRuntime.task(taskId);

            ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
                    .processInstanceId(task.getProcessInstanceId())
                    .singleResult();

            if (input != null && !input.isBlank()) {
                Map<String, Object> formData = new HashMap<>();
                formData.put("formData", input);
                runtimeService.setVariable(task.getProcessInstanceId(), task.getTaskDefinitionKey(), formData);

                Map<String, Object> variables = runtimeService.getVariables(processInstance.getProcessInstanceId());
                System.out.println(new JSONObject(variables).toString());
                Map<String, Object> localTaskVariable = this.getTaskVariables(taskId);
                if (localTaskVariable.containsKey("draft")) {
                    localTaskVariable.remove("draft");
                    this.setTaskVariables(taskId, localTaskVariable);
                }
            }

            // TODO : debug purpose we have added this log.
            Map<String, Object> updatedvariables = runtimeService.getVariables(processInstance.getProcessInstanceId());
            for (Map.Entry<String,Object> entry : updatedvariables.entrySet()){
                log.debug("Key = " + entry.getKey() + ", Value = " + entry.getValue());
            }

            taskService.complete(taskId);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public void claimTask(String taskId, String userId) {
        taskService.claim(taskId, userId);
    }

    @Override
    public void delegateTask(String taskId, String userId) {
        taskService.delegateTask(taskId, userId);
    }

    @Override
    public List<org.activiti.engine.task.Task> getTasksForUser(String assignee) {
        return taskService.createTaskQuery().taskAssignee(assignee).list();
    }

    @Override
    public List<org.activiti.engine.task.Task> getTasksForGroup(String candidateGroup) {
        return taskService.createTaskQuery().taskCandidateGroup(candidateGroup).list();
    }

    @Override
    public List<ProcessInstance> getAllProcessInstances() {
        return runtimeService.createProcessInstanceQuery().list();
    }

    @Override
    public ProcessInstance getProcessInstanceById(String processInstanceId) {
        return runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
    }

    @Override
    public void deleteProcessInstance(String processInstanceId) {
        runtimeService.deleteProcessInstance(processInstanceId, "Deleted by user");
    }

    @Override
    public String deployProcessDefinition(String name, byte[] bpmnData) {
        String id = repositoryService.createDeployment().addBytes(name + ".bpmn", bpmnData).deploy().getId();
        return repositoryService.createProcessDefinitionQuery().deploymentId(id).singleResult().getKey();
    }

    @Override
    public String deployProcessDefinition(String pathToBpmnFile) {
        try (InputStream inputStream = new FileInputStream(pathToBpmnFile)) {
            return repositoryService.createDeployment()
                    .addInputStream(pathToBpmnFile, inputStream)
                    .deploy().getId();
        } catch (IOException e) {
            throw new RuntimeException("Failed to deploy process definition", e);
        }
    }

    @Override
    public void suspendProcessDefinition(String processDefinitionId) {
        repositoryService.suspendProcessDefinitionById(processDefinitionId);
    }

    @Override
    public void activateProcessDefinition(String processDefinitionId) {
        repositoryService.activateProcessDefinitionById(processDefinitionId);
    }

    @Override
    public void deleteProcessDefinition(String processDefinitionId) {
        repositoryService.deleteDeployment(processDefinitionId, true);
    }

    @Override
    public TaskDTO getUserNodeDetails(String taskId) throws Exception {
        TaskDTO task = null;
        try {
            // TODO: We have not integrated authentication in application,
            //  Problem : We can not read task details without Auth
            //  Error: Unauthorized.
            //  Response if task not found for given user : Unable to find task for the given id: TaskId for user: user1 (with groups: [] & with roles: [USER]),

            // TODO : Temp code to fix above problem
            UserDetails userDetails = pemUserDetailsService.loadUserByUsername("user1");
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            HistoricTaskInstance hti = historyService.createHistoricTaskInstanceQuery().taskId(taskId).singleResult();
            if(Objects.nonNull(hti.getStartTime()) && Objects.nonNull(hti.getEndTime())) {
                task = mapper.map(hti, TaskDTO.class);
                task.setCompletedDate(hti.getEndTime());
                task.setStatus("COMPLETED");

                Map<String, Object> variables = (Map<String, Object>) this.getHistoricProcessVariables(task.getProcessInstanceId()).get(task.getTaskDefinitionKey());
                task.setFormData((String) variables.get("formData"));
            }else {
                org.activiti.api.task.model.Task actTask = taskRuntime.task(taskId);
                task = mapper.map(actTask, TaskDTO.class);
                task.setFormData((String) this.getTaskVariables(taskId).get("draft"));
                task.setStatus("IN_PROGRESS");
            }
            HistoricProcessInstance processInstance = historyService.createHistoricProcessInstanceQuery()
                    .processInstanceId(task.getProcessInstanceId())
                    .singleResult();
            if (processInstance != null) {
                String processDefinitionId = processInstance.getProcessDefinitionId();
                // Get the BPMN model using the process definition ID
                InputStream processStream = repositoryService.getProcessModel(processDefinitionId);
                BpmnModel bpmnModel = null;

                String text = new String(processStream.readAllBytes(), StandardCharsets.UTF_8);
                //TODO need to change
                String base64String = new String(Base64.getDecoder().decode(text));
                processStream = new ByteArrayInputStream(base64String.getBytes());
                bpmnModel = new BpmnXMLConverter().convertToBpmnModel(new InputStreamSource(processStream), false, false);

                List<UserTask> userTaskList = new ArrayList<>();
                getUserTasks(bpmnModel.getMainProcess().getFlowElements().stream().toList(), userTaskList, task.getTaskDefinitionKey());
                UserTask userTask = userTaskList.get(0);
                if (userTask != null) {
                    for (FormProperty formProperty : userTask.getFormProperties()) {
                        if (formProperty.getName().equals("form")) {
                            task.setForm(formProperty.getVariable());
                        } else if (formProperty.getName().equals("formNodeType")) {
                            task.setFormNodeType(formProperty.getVariable());
                        }
                    }
                }
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
        return task;
    }

    @Override
    public void getUserTasks(List<FlowElement> mainList, List<UserTask> userTaskList, String taskDefKey) {
        if (taskDefKey != null && !userTaskList.isEmpty())
            return;
        mainList.forEach(f -> {
            if (f.getClass().equals(UserTask.class)) {
                if (taskDefKey == null) {
                    userTaskList.add((UserTask) f);
                } else {
                    if (taskDefKey.equals(f.getId())) {
                        userTaskList.add((UserTask) f);
                        return;
                    }
                }
            } else if (f.getClass().equals(SubProcess.class)) {
                getUserTasks(((SubProcess) f).getFlowElements().stream().toList(), userTaskList, taskDefKey);
            }
        });
    }

    @Override
    public Map<String, Object> getProcessStatus(String processInstanceId) {
        Map<String, Object> statusData = new HashMap<>();
        HistoricActivityInstanceQuery query = historyService.createHistoricActivityInstanceQuery()
                .processInstanceId(processInstanceId)
                .activityType("subProcess")
                .orderByHistoricActivityInstanceStartTime().asc();
        // Execute the query
        List<HistoricActivityInstance> historicActivityInstances = query.list();
        // Iterate through the results and print the activity details
        for (HistoricActivityInstance historicActivityInstance : historicActivityInstances) {
            Map<String, Object> subProcessData = new HashMap<>();
            subProcessData.put("isExecutable" , false);
            Map<String, Object> status = new HashMap<>();
            if(historicActivityInstance.getStartTime()!=null && historicActivityInstance.getEndTime()!=null){
                subProcessData.put("Status",Constants.COMPLETED);
            }else if(historicActivityInstance.getStartTime()!=null && historicActivityInstance.getEndTime()==null){
                subProcessData.put("Status",Constants.IN_PROGRESS);
            }

            List<Execution> executions = runtimeService.createExecutionQuery()
                    .parentId(historicActivityInstance.getExecutionId())
                    .list();

            for (Execution execution : executions) {
                Job job = processEngine.getManagementService().createDeadLetterJobQuery()
                        .executionId(execution.getId()).withException().singleResult();
                if(job != null){
                    subProcessData.put("Status",Constants.ERROR);
                    subProcessData.put("ErrorDetails",job.getExceptionMessage());
                    subProcessData.put("isExecutable" , true);
                }else if(execution.isEnded()){
                    subProcessData.put("Status",Constants.COMPLETED);
                }

                List<org.activiti.engine.task.Task> activeUserTasks = taskService.createTaskQuery()
                        .executionId(execution.getId())
                        .active()
                        .includeTaskLocalVariables()
                        .list();
                List<String> taskList = new ArrayList<>();
                for (org.activiti.engine.task.Task task : activeUserTasks) {
                    try {
                        TaskDTO taskDetails= getUserNodeDetails(task.getId());
                        System.out.println(taskDetails.getFormNodeType());
                        taskList.add(task.getId());
                        if(taskDetails.getFormNodeType().equalsIgnoreCase(ApplicationConstants.AUTO_FORM_NODE)){
                            HistoricTaskInstance historicTask = historyService.createHistoricTaskInstanceQuery()
                                    .taskId(task.getId()).singleResult();
                            if(historicTask.getStartTime()!=null && historicTask.getEndTime()==null) {
                                subProcessData.put("Status",Constants.NOT_STARTED);
                            }
                        }else{
                            subProcessData.put("Status",Constants.FORM_NODE_ACTIVE);
                        }
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }

                if(!taskList.isEmpty()){
                    subProcessData.put("isExecutable" , true);
                    subProcessData.put("NextExecutableNode",taskList);
                }

            }

            subProcessData.put("TaskID" , historicActivityInstance.getActivityId());
            subProcessData.put("TaskName" , historicActivityInstance.getActivityName());
            subProcessData.put("StartTime" , historicActivityInstance.getStartTime());
            subProcessData.put("EndTime", historicActivityInstance.getEndTime());
            statusData.put(historicActivityInstance.getActivityId(), subProcessData);
        }
        return statusData;
    }


    public Map<String, Object> getProcessStatus(String processInstanceId, String userRole) throws Exception {
        String status = "";
        String subProcessType = "";
        String taskKey = "";
        TaskDTO taskDto = null;
        List<String> taskIds = new ArrayList<>();
        if (processInstanceId == null || processInstanceId.isBlank()) {
            status = Constants.NOT_STARTED;
        } else {
            List<org.activiti.engine.task.Task> taskList =  taskService.createTaskQuery().processInstanceId(processInstanceId).list();
            if(taskList.size() > 0){
                taskDto = getUserNodeDetails(taskList.get(0).getId());
            }
            status = getProcessInstanceStatus(processInstanceId);
            taskIds = getActiveUserTasksIdForProcessInstance(processInstanceId);
            if (status.equals(Constants.IN_PROGRESS)) {
                FlowElement subProcess = getSubProcess(processInstanceId);
                if (subProcess != null) {
                    taskKey = subProcess.getId();
                    subProcessType = getExtensionElementValue(subProcess.getExtensionElements(), "type", "string");
                    if (userRole.equals("PARTNER") && subProcessType.equals("SPONSOR")) {
                        status = Constants.SPONSOR_ACTION;
                        taskIds = new ArrayList<>();
                    }
                }
                if (!taskIds.isEmpty()) {
                    if(taskDto != null && taskDto.getFormNodeType().equals(ApplicationConstants.AUTO_FORM_NODE)){
                        status = Constants.NOT_STARTED;
                    }else {
                        status = Constants.FORM_NODE_ACTIVE;
                    }
                }
            }
        }
        return Map.of("Status", status, "TaskType", subProcessType, "TaskKey", taskKey, "ExecutableNode", taskIds);
    }

    public String getProcessInstanceStatus(String processInstanceId) {
        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
                .processInstanceId(processInstanceId)
                .singleResult();

        if (processInstance != null) {
            if (processInstance.isEnded()) {
                return Constants.COMPLETED;
            } else {
                return Constants.IN_PROGRESS;
            }
        } else {
            HistoricProcessInstance historicProcessInstance = historyService.createHistoricProcessInstanceQuery()
                    .processInstanceId(processInstanceId)
                    .singleResult();
            if (historicProcessInstance != null) {
                if (historicProcessInstance.getEndTime() != null) {
                    return Constants.COMPLETED;
                } else if (historicProcessInstance.getDeleteReason() != null) {
                    return Constants.CLOSED;
                }
            }
            //TODO check the feasibility for ERROR status
            return Constants.ERROR;
        }
    }

    public List<String> getActiveUserTasksIdForProcessInstance(String processInstanceId) {
        List<org.activiti.engine.task.Task> userTasks = taskService.createTaskQuery()
                .processInstanceId(processInstanceId)
                .active()
                .list();
        return userTasks.stream().map(p -> p.getId()).toList();
    }

    public FlowElement getSubProcess(String processInstanceId) {
        List<Execution> executionList = runtimeService.createExecutionQuery()
                .processInstanceId(processInstanceId).onlySubProcessExecutions()
                .list();
        if (executionList.isEmpty())
            return null;
        ExecutionEntityImpl execution = (ExecutionEntityImpl) executionList.get(0);
        return getFlowElementById(execution.getProcessDefinitionId(), execution.getActivityId());
    }

    public FlowElement getFlowElementById(String processDefinitionId, String elementId) {
        BpmnModel bpmnModel = repositoryService.getBpmnModel(processDefinitionId);
        return bpmnModel.getMainProcess().getFlowElement(elementId, true);
    }

    public String getExtensionElementValue(Map<String, List<ExtensionElement>> extensionElements, String attName, String valueType) {
        if (extensionElements != null) {
            for (Map.Entry<String, List<ExtensionElement>> entry : extensionElements.entrySet()) {
                for (ExtensionElement extensionElement : entry.getValue()) {
                    if (extensionElement.getAttributeValue(null, "name").equals(attName)) {
                        ExtensionElement element = extensionElement.getChildElements().get(valueType).get(0);
                        return element.getElementText();
                    }
                }
            }
        }
        return null;
    }

    @Override
    public Map<String, Object> getHistoricProcessVariables(String processInstanceId) {
        return historyService.createHistoricVariableInstanceQuery().processInstanceId(processInstanceId).list().stream().collect(Collectors.toMap(t -> t.getVariableName(), t -> t.getValue()));
    }

    @Override
    public Map<String, Object> getTaskVariables(String taskId) {
        return taskService.getVariablesLocal(taskId);
    }

    @Override
    public Map<String, Object> getProcessVariables(String processId) {
        return runtimeService.getVariables(processId);
    }

    @Override
    public void setProcessVariable(String processId, String key, Object value) {
        runtimeService.setVariable(processId, key, value);
    }

    @Override
    public void setTaskVariables(String taskId, Map<String, Object> variables) {
        taskService.setVariablesLocal(taskId,variables);
    }

    @Override
    public List<HistoricProcessInstance> queryHistoricProcessInstances() {
        return historyService.createHistoricProcessInstanceQuery().list();
    }

    @Override
    public List<HistoricTaskInstance> queryHistoricTaskInstances() {
        return historyService.createHistoricTaskInstanceQuery().list();
    }

    @Override
    public HistoricProcessInstance getHistoricProcessInstanceById(String processInstanceId) {
        return historyService.createHistoricProcessInstanceQuery()
                .processInstanceId(processInstanceId)
                .singleResult();
    }

    @Override
    public void createUser(User user) {
    }

    @Override
    public void updateUser(User user) {
    }

    @Override
    public void deleteUser(String userId) {
    }

    @Override
    public void deleteGroup(String groupId) {
    }

    @Override
    public void deployProcess(String pathToBpmnFile) {
        deployProcessDefinition(pathToBpmnFile);
    }

    @Override
    public void undeployProcess(String deploymentId) {
        repositoryService.deleteDeployment(deploymentId, true);
    }

    @Override
    public void handleProcessEvents() {
        // Implement event handling logic here
    }

    @Override
    public boolean checkUserPermissions(String userId, String permission) {
        // Implement permission check logic here
        return true;
    }

    @Override
    public void defineAccessControlList(String processDefinitionId, List<String> userIds, List<String> groupIds) {
        // Implement ACL definition logic here
    }

    @Override
    public int countSubprocesses(String activityDefnData) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        int subprocessCount = 0;
        PemBpmnModel pemBpmnModel = objectMapper.readValue(activityDefnData, new TypeReference<>() {});
        for(Node node : pemBpmnModel.getProcess().getNodes()){
            if (AbstractNodeHandler.isSubProcess(node.getType())){
                subprocessCount += countSubprocessesRecursive(node);
            }
        }
        return subprocessCount;
    }

    /**
     * Not Started - task has not been started
     * In Progress - task is being actively worked upon
     * Waiting for user action - a form node is active and requires a user to submit
     * Completed - task is completed
     * Error - an API/XSLT node failed, or task's exit condition failed.
    */
    @Override
    public boolean setOwnerToRunningTasks(String processInstanceId, List<String> userKeys, List<String> roleKeys) {

        HistoricActivityInstanceQuery query = historyService.createHistoricActivityInstanceQuery()
                .processInstanceId(processInstanceId)
                .activityType("subProcess")
                .orderByHistoricActivityInstanceStartTime().asc();

        // Execute the query
        List<HistoricActivityInstance> historicActivityInstances = query.list();

        // Iterate through the results and print the activity details
        for (HistoricActivityInstance historicActivityInstance : historicActivityInstances) {

            List<Execution> executions = runtimeService.createExecutionQuery()
                    .parentId(historicActivityInstance.getExecutionId())
                    .list();

            for (Execution execution : executions) {
                String activityId = execution.getActivityId();
                if (activityId != null) {
                    log.debug("Service Task Activity ID: {}", activityId);
                }

                List<org.activiti.engine.task.Task> activeUserTasks = taskService.createTaskQuery()
                        .executionId(execution.getId())
                        .active()
                        .includeTaskLocalVariables()
                        .list();
                for (org.activiti.engine.task.Task task : activeUserTasks) {
                    userKeys.forEach(userKey -> taskService.addCandidateUser(task.getId(),userKey));
                    roleKeys.forEach(roleKey -> taskService.addCandidateGroup(task.getId(),roleKey));
                }
            }
        }

        return true;
    }

    private static int countSubprocessesRecursive(Node node) {
        int count = 0;
        if (AbstractNodeHandler.isSubProcess(node.getType())) {
            count++;

            // Recursive call to count subprocesses within this subprocess
            for(Node subNode : node.getNodes()){
                if (AbstractNodeHandler.isSubProcess(subNode.getType())){
                    count += countSubprocessesRecursive(subNode);
                }
            }
        }

        return count;
    }

}
