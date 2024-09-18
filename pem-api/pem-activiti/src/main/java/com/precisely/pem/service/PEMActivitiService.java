package com.precisely.pem.service;

import com.precisely.pem.dtos.task.TaskDTO;
import org.activiti.bpmn.model.FlowElement;
import org.activiti.bpmn.model.UserTask;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.springframework.security.core.userdetails.User;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface PEMActivitiService {

    // Process Management

    /**
     * Starts a new process instance using the given process definition key.
     *
     * @param processDefinitionKey the key of the process definition to start
     * @return the started ProcessInstance
     */
    ProcessInstance startProcessInstanceByKey(String processDefinitionKey);

    /**
     * Starts a new process instance using the given process definition key.
     *
     * @param processDefinitionKey the key of the process definition to start
     * @param variables the initial variables for the process definition to start
     * @return the started ProcessInstance
     */
    String startProcessInstanceByKey(String processDefinitionKey, Map<String, Object> variables);


    /*
     * Starts a new process instance using the given process definition ID.
     *
     * @param processDefinitionId the ID of the process definition to start
     * @return the started ProcessInstance ID
     */
    String startProcessInstanceById(String processDefinitionId);

    /*
     * Starts a new process instance using the given process definition ID.
     *
     * @param processDefinitionId the ID of the process definition to start
     * @param businessKey businessKey of process definition
     * @return the started ProcessInstance ID
     */
    String startProcessInstanceById(String processDefinitionId, String businessKey, Map<String, Object> variables);


    /**
     * Completes a node identified by the given task ID.
     *
     * @param taskId the ID of the task to complete
     * @param input data the ID of the task to complete
     */
    void completeUserNode(String taskId, String input) throws Exception;

    /**
     * Claims a task for a specific user.
     *
     * @param taskId the ID of the task to claim
     * @param userId the ID of the user claiming the task
     */
    void claimTask(String taskId, String userId);

    /**
     * Delegates a task to a specific user.
     *
     * @param taskId the ID of the task to delegate
     * @param userId the ID of the user to delegate the task to
     */
    void delegateTask(String taskId, String userId);

    /**
     * Retrieves the tasks assigned to a specific user.
     *
     * @param assignee the ID of the user to whom the tasks are assigned
     * @return a list of tasks assigned to the specified user
     */
    List<Task> getTasksForUser(String assignee);

    /**
     * Retrieves all user nodes in given process definition.
     *
     * @param mainList all flow element list as inputs
     * @param userTaskList user task list as output
     * @param taskDefKey task id for which we are getting user task list as output
     */
    void getUserTasks(List<FlowElement> mainList, List<UserTask> userTaskList, String taskDefKey);

    /**
     * Read process status for given process ID.
     *
     * @param processInstanceId process Instance Id
     * @return map of variables
     */
    Map<String, Object> getProcessStatus(String processInstanceId);

    /**
     * Read process status for given process ID.
     *
     * @param processInstanceId process Instance Id
     * @param userRole login userRole
     * @return map of variables
     */
    Map<String, Object> getProcessStatus(String processInstanceId, String userRole) throws Exception;

    /**
     * Read all variables for given process ID.
     *
     * @param processInstanceId process Instance Id
     * @return map of variables
     */
    Map<String, Object> getHistoricProcessVariables(String processInstanceId);

        /**
         * Retrieves the tasks available for a specific candidate group.
         *
         * @param candidateGroup the name of the candidate group
         * @return a list of tasks available for the specified candidate group
         */
    List<Task> getTasksForGroup(String candidateGroup);

    /**
     * Retrieves all active process instances.
     *
     * @return a list of all active process instances
     */
    List<ProcessInstance> getAllProcessInstances();

    /**
     * Retrieves a process instance by its ID.
     *
     * @param processInstanceId the ID of the process instance to retrieve
     * @return the ProcessInstance with the specified ID
     */
    ProcessInstance getProcessInstanceById(String processInstanceId);

    /**
     * Deletes a process instance by its ID.
     *
     * @param processInstanceId the ID of the process instance to delete
     */
    void deleteProcessInstance(String processInstanceId);


    // Process Definition Management

    /**
     * Deploys a process definition from a given BPMN file path.
     *
     * @param name the name of the definition to deploy
     * @param bpmnData the data of the definition to deploy
     * @return the ProcessDefinition with the Deployment key
     */
    String deployProcessDefinition(String name, byte[] bpmnData);

    /**
     * Deploys a process definition from a given BPMN file path.
     *
     * @param pathToBpmnFile the path to the BPMN file to deploy
     * @return the ProcessDefinition with the Deployment ID
     */
    String deployProcessDefinition(String pathToBpmnFile);

    /**
     * Suspends a process definition by its ID.
     *
     * @param processDefinitionId the ID of the process definition to suspend
     */
    void suspendProcessDefinition(String processDefinitionId);

    /**
     * Activates a suspended process definition by its ID.
     *
     * @param processDefinitionId the ID of the process definition to activate
     */
    void activateProcessDefinition(String processDefinitionId);

    /**
     * Deletes a process definition by its ID.
     *
     * @param processDefinitionId the ID of the process definition to delete
     */
    void deleteProcessDefinition(String processDefinitionId);


    // Task Management

    /**
     * Retrieves the task details associated with a specific task.
     *
     * @param taskId the ID of the task to retrieve variables from
     * @return a TaskDTO associated with the specified task
     */
    TaskDTO getUserNodeDetails(String taskId) throws Exception;

    /**
     * Retrieves the variables associated with a specific task.
     *
     * @param taskId the ID of the task to retrieve variables from
     * @return a map of variables associated with the specified task
     */
    Map<String, Object> getTaskVariables(String taskId);

    /**
     * Retrieves the variables associated with a specific task.
     *
     * @param processId the ID of the task to retrieve variables from
     * @return a map of variables associated with the specified task
     */
    Map<String, Object> getProcessVariables(String processId);

    /**
     * Sets the variables for a specific task.
     *
     * @param processId    the ID of the task to set variables for
     * @param key the variables to set
     */
    void setProcessVariable(String processId, String key, Object value);

    /**
     * Sets the variables for a specific task.
     *
     * @param taskId    the ID of the task to set variables for
     * @param variables the variables to set
     */
    void setTaskVariables(String taskId, Map<String, Object> variables);


    // Historic Data

    /**
     * Queries for historic process instances.
     *
     * @return a list of historic process instances
     */
    List<HistoricProcessInstance> queryHistoricProcessInstances();

    /**
     * Queries for historic task instances.
     *
     * @return a list of historic task instances
     */
    List<HistoricTaskInstance> queryHistoricTaskInstances();

    /**
     * Retrieves a historic process instance by its ID.
     *
     * @param processInstanceId the ID of the historic process instance to retrieve
     * @return the HistoricProcessInstance with the specified ID
     */
    HistoricProcessInstance getHistoricProcessInstanceById(String processInstanceId);


    // Identity Management

    /**
     * Creates a new user.
     *
     * @param user the user to create
     */
    void createUser(User user);

    /**
     * Updates an existing user.
     *
     * @param user the user to update
     */
    void updateUser(User user);

    /**
     * Deletes a user by their ID.
     *
     * @param userId the ID of the user to delete
     */
    void deleteUser(String userId);

    /**
     * Deletes a group by its ID.
     *
     * @param groupId the ID of the group to delete
     */
    void deleteGroup(String groupId);


    // Deployment

    /**
     * Deploys a process definition from a given BPMN file path.
     *
     * @param pathToBpmnFile the path to the BPMN file to deploy
     */
    void deployProcess(String pathToBpmnFile);

    /**
     * Undeploys a process definition by its deployment ID.
     *
     * @param deploymentId the ID of the deployment to undeploy
     */
    void undeployProcess(String deploymentId);


    // Event Handling

    /**
     * Handles process events. The implementation should define the logic for handling events.
     */
    void handleProcessEvents();


    // Security

    /**
     * Checks if a user has a specific permission.
     *
     * @param userId     the ID of the user
     * @param permission the permission to check
     * @return true if the user has the specified permission, false otherwise
     */
    boolean checkUserPermissions(String userId, String permission);

    /**
     * Defines an access control list (ACL) for a process definition.
     *
     * @param processDefinitionId the ID of the process definition
     * @param userIds             the list of user IDs to include in the ACL
     * @param groupIds            the list of group IDs to include in the ACL
     */
    void defineAccessControlList(String processDefinitionId, List<String> userIds, List<String> groupIds);

    int countSubprocesses(String activityDefnData) throws IOException;


    /**
     * Sets the owners for a running tasks already started.
     *
     * @param processInstanceId    the ID of the task to set variables for
     * @param userKeys the userKeys to set
     * @param roleKeys the roleKeys to set
     */
    boolean setOwnerToRunningTasks(String processInstanceId, List<String> userKeys, List<String> roleKeys);

} 

 