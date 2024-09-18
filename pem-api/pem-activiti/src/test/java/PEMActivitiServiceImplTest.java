import com.precisely.pem.commonUtil.ApplicationConstants;
import com.precisely.pem.config.PEMUserDetailsService;
import com.precisely.pem.dtos.task.TaskDTO;
import com.precisely.pem.service.PEMActivitiServiceImpl;
import org.activiti.api.task.runtime.TaskRuntime;
import org.activiti.engine.HistoryService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.*;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.DeploymentBuilder;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.repository.ProcessDefinitionQuery;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.runtime.ProcessInstanceQuery;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PEMActivitiServiceImplTest {
    @Mock
    private RepositoryService repositoryService;
    @Mock
    private TaskService taskService;
    @Mock
    private RuntimeService runtimeService;
    @Mock
    private DeploymentBuilder deploymentBuilder;
    @Mock
    private Deployment deployment;
    @Mock
    private PEMUserDetailsService pemUserDetailsService;
    @Mock
    private TaskRuntime taskRuntime;
    @Mock
    private ModelMapper mapper;
    @Mock
    private ProcessDefinitionQuery processDefinitionQuery;
    @Mock
    private ProcessDefinition processDefinition;
    @Mock
    private Task mockTask;
    @Mock
    private ProcessInstance mockProcessInstance;
    @Mock
    private TaskQuery taskQuery;
    @Mock
    private ProcessInstanceQuery processInstanceQuery;
    @InjectMocks
    private PEMActivitiServiceImpl pemActivitiService;

    @Mock
    private HistoryService historyService;
    @Mock
    private HistoricTaskInstanceQuery historicTaskInstanceQuery;
    @Mock
    private HistoricProcessInstanceQuery historicProcessInstanceQuery;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(repositoryService.createDeployment()).thenReturn(deploymentBuilder);
        when(deploymentBuilder.addBytes(anyString(), any())).thenReturn(deploymentBuilder);
        when(deploymentBuilder.addInputStream(anyString(), any(InputStream.class))).thenReturn(deploymentBuilder);
        when(deploymentBuilder.deploy()).thenReturn(deployment);
        when(repositoryService.createProcessDefinitionQuery()).thenReturn(processDefinitionQuery);
        when(processDefinitionQuery.deploymentId(anyString())).thenReturn(processDefinitionQuery);
        when(processDefinitionQuery.singleResult()).thenReturn(processDefinition);
        when(taskService.createTaskQuery()).thenReturn(taskQuery);
        when(taskQuery.taskAssignee(anyString())).thenReturn(taskQuery);
        when(taskQuery.taskCandidateGroup(anyString())).thenReturn(taskQuery);
        when(taskQuery.list()).thenReturn(Collections.singletonList(mockTask));
        when(runtimeService.createProcessInstanceQuery()).thenReturn(processInstanceQuery);
        when(processInstanceQuery.list()).thenReturn(Collections.singletonList(mockProcessInstance));

        when(processDefinition.getKey()).thenReturn("testProcessKey");
    }

    @Test
    void StartProcessInstanceByKey_Positive() {
        when(runtimeService.startProcessInstanceByKey("testKey")).thenReturn(mockProcessInstance);
        ProcessInstance result = pemActivitiService.startProcessInstanceByKey("testKey");
        assertEquals(mockProcessInstance, result);
    }

    @Test
    void testCompleteUserNode() throws Exception {
        String taskId = "testTaskId";
        String input = "testInput";
        org.activiti.api.task.model.Task mockTask = mock( org.activiti.api.task.model.Task.class);
        ProcessInstance mockProcessInstance = mock(ProcessInstance.class);
        UserDetails mockUserDetails = mock(UserDetails.class);
        ProcessInstanceQuery mockProcessInstanceQuery = mock(ProcessInstanceQuery.class);
        when(pemUserDetailsService.loadUserByUsername(anyString())).thenReturn(mockUserDetails);
        when(taskRuntime.task(anyString())).thenReturn(mockTask);
        when(mockTask.getProcessInstanceId()).thenReturn("testProcessInstanceId");
        when(runtimeService.createProcessInstanceQuery()).thenReturn(mockProcessInstanceQuery);
        when(mockProcessInstanceQuery.processInstanceId(anyString())).thenReturn(mockProcessInstanceQuery);
        when(mockProcessInstanceQuery.singleResult()).thenReturn(mockProcessInstance);
        when(runtimeService.getVariables(anyString())).thenReturn(new HashMap<>());
        when(pemActivitiService.getTaskVariables(anyString())).thenReturn(new HashMap<>());
        pemActivitiService.completeUserNode(taskId, input);
        verify(taskRuntime, times(1)).task(taskId);
        verify(taskService, times(1)).complete(taskId);
    }

    @Test
    void testCompleteUserNodeThrowsException() {
        String taskId = "testTaskId";
        String input = "testInput";
        when(taskRuntime.task(anyString())).thenThrow(new RuntimeException("Task not found"));
        Exception exception = assertThrows(Exception.class, () -> {
            pemActivitiService.completeUserNode(taskId, input);
        });
        assertNotNull(exception);
    }

    @Test
    void testGetUserNodeDetails() throws Exception {
        String taskId = "testTaskId";
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setId(taskId);
        taskDTO.setTaskDefinitionKey("UserTask_1");
        taskDTO.setProcessInstanceId("testProcessInstanceId");
        taskDTO.setFormNodeType(ApplicationConstants.CUSTOM_FORM_NODE);

        UserDetails mockUserDetails = mock(UserDetails.class);
        when(pemUserDetailsService.loadUserByUsername(anyString())).thenReturn(mockUserDetails);

        String mockBpmnContent = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPGJwbW4yOmRlZmluaXRpb25zIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhtbG5zOmJwbW4yPSJodHRwOi8vd3d3Lm9tZy5vcmcvc3BlYy9CUE1OLzIwMTAwNTI0L01PREVMIiB4bWxuczpicG1uZGk9Imh0dHA6Ly93d3cub21nLm9yZy9zcGVjL0JQTU4vMjAxMDA1MjQvREkiIHhtbG5zOmRjPSJodHRwOi8vd3d3Lm9tZy5vcmcvc3BlYy9ERC8yMDEwMDUyNC9EQyIgeG1sbnM6ZGk9Imh0dHA6Ly93d3cub21nLm9yZy9zcGVjL0RELzIwMTAwNTI0L0RJIiB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOmFjdGl2aXRpPSJodHRwOi8vYWN0aXZpdGkub3JnL2JwbW4iIGlkPSJEZWZpbml0aW9uc18xIiBleHBvcnRlcj0ib3JnLmVjbGlwc2UuYnBtbjIubW9kZWxlci5jb3JlIiBleHBvcnRlclZlcnNpb249IjEuNS40LlJDMS12MjAyMjExMTgtMTA0Ny1CMSIgdGFyZ2V0TmFtZXNwYWNlPSJFeGFtcGxlcyI+CiAgPGJwbW4yOnByb2Nlc3MgaWQ9InV0MSIgbmFtZT0idXQxIiBpc0V4ZWN1dGFibGU9InRydWUiPgogICAgPGJwbW4yOnN0YXJ0RXZlbnQgaWQ9IlN0YXJ0RXZlbnRfMSIgbmFtZT0iU3RhcnQgSlMgRXZlbnQiPgogICAgICA8YnBtbjI6b3V0Z29pbmc+U2VxdWVuY2VGbG93XzM8L2JwbW4yOm91dGdvaW5nPgogICAgPC9icG1uMjpzdGFydEV2ZW50PgogICAgPGJwbW4yOmVuZEV2ZW50IGlkPSJFbmRFdmVudF8xIiBuYW1lPSJKUyBFbmQgRXZlbnQiPgogICAgICA8YnBtbjI6aW5jb21pbmc+U2VxdWVuY2VGbG93XzQ8L2JwbW4yOmluY29taW5nPgogICAgPC9icG1uMjplbmRFdmVudD4KICAgIDxicG1uMjp1c2VyVGFzayBpZD0iVXNlclRhc2tfMSIgbmFtZT0iVXNlciBUYXNrIDEiIGFjdGl2aXRpOmFzc2lnbmVlPSJ1c2VyMSI+Cgk8YnBtbjI6ZXh0ZW5zaW9uRWxlbWVudHM+CjxhY3Rpdml0aTpmb3JtUHJvcGVydHkgaWQ9ImZvcm0iIG5hbWU9ImZvcm0iIHR5cGU9InN0cmluZyIgdmFyaWFibGU9InsmcXVvdDtmaWVsZHMmcXVvdDs6W3smcXVvdDtpZCZxdW90OzomcXVvdDsxZjE2MTM5Ni02ODFhLTRhZTgtYjE2Zi00ZjRlNGVkMjgyYWQmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDt0ZXh0aW5wdXQmcXVvdDssJnF1b3Q7bGFiZWxUZXh0JnF1b3Q7OiZxdW90O0VtYWlsJnF1b3Q7LCZxdW90O2hlbHBlclRleHQmcXVvdDs6JnF1b3Q7RW50ZXIgZW1haWwmcXVvdDssJnF1b3Q7bWluJnF1b3Q7OnsmcXVvdDt2YWx1ZSZxdW90OzomcXVvdDszJnF1b3Q7LCZxdW90O21lc3NhZ2UmcXVvdDs6JnF1b3Q7dmFsdWUgc2hvdWxkIGJlIG1pbiAzIGNoYXImcXVvdDt9LCZxdW90O21heCZxdW90Ozp7JnF1b3Q7dmFsdWUmcXVvdDs6JnF1b3Q7NSZxdW90OywmcXVvdDttZXNzYWdlJnF1b3Q7OiZxdW90O3ZhbHVlIHNob3VsZCBiZSBtYXggNSBjaGFyJnF1b3Q7fSwmcXVvdDtpc1JlcXVpcmVkJnF1b3Q7OnsmcXVvdDt2YWx1ZSZxdW90Ozp0cnVlLCZxdW90O21lc3NhZ2UmcXVvdDs6JnF1b3Q7aXNSZXF1aXJlZCZxdW90O319LHsmcXVvdDtpZCZxdW90OzomcXVvdDs2ODIxMjdjMS1mODk0LTQ4OGItOTdkYi01ZDA2YmY4ZGZmODkmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDt0ZXh0YXJlYSZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7VGV4dEFyZWEmcXVvdDt9LHsmcXVvdDtpZCZxdW90OzomcXVvdDsxNDg4ZTk3YS05NzVkLTQ4MjItYjIyMy1mMGIwZmNjZjY2OTgmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDtzZWxlY3QmcXVvdDssJnF1b3Q7bGFiZWxUZXh0JnF1b3Q7OiZxdW90O1NlbGVjdCBGaWxlZCZxdW90O30seyZxdW90O2lkJnF1b3Q7OiZxdW90Ozc0NTAwMTdlLWUxNWEtNDI3OC04NmZhLWJiMDBjNDAwNjliNSZxdW90OywmcXVvdDt0eXBlJnF1b3Q7OiZxdW90O2NoZWNrYm94JnF1b3Q7LCZxdW90O2xhYmVsVGV4dCZxdW90OzomcXVvdDtDaGVjayBCb3gmcXVvdDt9LHsmcXVvdDtpZCZxdW90OzomcXVvdDthNmJjZDBmOS04NDJjLTRmNmYtODhmMS1mMjMyYzJlNTlhMzAmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDtyYWRpbyZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7UmFkaW8mcXVvdDt9LHsmcXVvdDtpZCZxdW90OzomcXVvdDs5NDMxZjc1Ni0xMGMwLTRjYTUtYmFiMS0zYmEyN2QzM2MwYzMmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDt0b2dnbGUmcXVvdDssJnF1b3Q7bGFiZWxUZXh0JnF1b3Q7OiZxdW90O1RvZ2dsZXImcXVvdDt9LHsmcXVvdDtpZCZxdW90OzomcXVvdDszYjZlZDU0Ny1mNDYwLTRlZDctOWNjOS0xYzQ3ZjY0ZTM5ZTcmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDtsaW5rJnF1b3Q7LCZxdW90O2xhYmVsVGV4dCZxdW90OzomcXVvdDtMaW5rJnF1b3Q7fSx7JnF1b3Q7aWQmcXVvdDs6JnF1b3Q7ZWQzZjdiNDktMDI2NS00ZmJlLThkNGEtNmJlMGE5Nzc1OTIyJnF1b3Q7LCZxdW90O3R5cGUmcXVvdDs6JnF1b3Q7ZGF0ZXBpY2tlciZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7RGF0ZSBQaWNrZXImcXVvdDt9LHsmcXVvdDtpZCZxdW90OzomcXVvdDsyOWU2MWE5OC05NjhkLTQzMDMtYjc3Ny0wOTU5OTI3YWVmZTkmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDt0YWImcXVvdDssJnF1b3Q7Y2hpbGRyZW4mcXVvdDs6W3smcXVvdDtpZCZxdW90OzomcXVvdDs0Mzk2OWUxYy0xNDkwLTQ3ZDgtYjc2Ny04NmM4OWJjZTkxYjMmcXVvdDssJnF1b3Q7dGFiVGl0bGUmcXVvdDs6JnF1b3Q7VGFiLTEmcXVvdDssJnF1b3Q7Y2hpbGRyZW4mcXVvdDs6W3smcXVvdDtpZCZxdW90OzomcXVvdDs2YmFmNmRmNy05YTgzLTRlYWQtYmU2NS00NzExZjZhNGY4ODcmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDtyYWRpbyZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7UmFkaW8gQnV0dG9uJnF1b3Q7fV19LHsmcXVvdDtpZCZxdW90OzomcXVvdDtmNjhmNjBkOS00NTM4LTQwNDctODM0My01MDRhOTI3YzhhNjYmcXVvdDssJnF1b3Q7dGFiVGl0bGUmcXVvdDs6JnF1b3Q7dGFiLTImcXVvdDssJnF1b3Q7Y2hpbGRyZW4mcXVvdDs6W3smcXVvdDtpZCZxdW90OzomcXVvdDs0Mzk4OWM2YS0xZThjLTRlNDAtYjAyYi03NDNmNmUwZDM1MzMmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDt0ZXh0YXJlYSZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7VGV4dCBBcmVhJnF1b3Q7fV19XX0seyZxdW90O2lkJnF1b3Q7OiZxdW90OzZkMTNkYWE0LWRhNDItNGQxNi04NTFkLTJkZjJiMDBmYzhhZiZxdW90OywmcXVvdDt0eXBlJnF1b3Q7OiZxdW90O2J1dHRvbiZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7U3VibWl0JnF1b3Q7fV19IiByZWFkYWJsZT0iZmFsc2UiIHdyaXRhYmxlPSJmYWxzZSI+PC9hY3Rpdml0aTpmb3JtUHJvcGVydHk+CjxhY3Rpdml0aTpmb3JtUHJvcGVydHkgaWQ9ImZvcm1Ob2RlVHlwZSIgbmFtZT0iZm9ybU5vZGVUeXBlIiB0eXBlPSJzdHJpbmciIHZhcmlhYmxlPSJDVVNUT01fRk9STV9OT0RFIj48L2FjdGl2aXRpOmZvcm1Qcm9wZXJ0eT4KPC9icG1uMjpleHRlbnNpb25FbGVtZW50cz4KICAgICAgPGJwbW4yOmluY29taW5nPlNlcXVlbmNlRmxvd18zPC9icG1uMjppbmNvbWluZz4KICAgICAgPGJwbW4yOm91dGdvaW5nPlNlcXVlbmNlRmxvd180PC9icG1uMjpvdXRnb2luZz4KICAgIDwvYnBtbjI6dXNlclRhc2s+CiAgICA8YnBtbjI6c2VxdWVuY2VGbG93IGlkPSJTZXF1ZW5jZUZsb3dfMyIgc291cmNlUmVmPSJTdGFydEV2ZW50XzEiIHRhcmdldFJlZj0iVXNlclRhc2tfMSIvPgogICAgPGJwbW4yOnNlcXVlbmNlRmxvdyBpZD0iU2VxdWVuY2VGbG93XzQiIHNvdXJjZVJlZj0iVXNlclRhc2tfMSIgdGFyZ2V0UmVmPSJFbmRFdmVudF8xIi8+CiAgPC9icG1uMjpwcm9jZXNzPgogIDxicG1uZGk6QlBNTkRpYWdyYW0gaWQ9IkJQTU5EaWFncmFtXzEiPgogICAgPGJwbW5kaTpCUE1OUGxhbmUgaWQ9IkJQTU5QbGFuZV8xIiBicG1uRWxlbWVudD0idXQxIj4KICAgICAgPGJwbW5kaTpCUE1OU2hhcGUgaWQ9IkJQTU5TaGFwZV9TdGFydEV2ZW50XzEiIGJwbW5FbGVtZW50PSJTdGFydEV2ZW50XzEiPgogICAgICAgIDxkYzpCb3VuZHMgaGVpZ2h0PSIzNi4wIiB3aWR0aD0iMzYuMCIgeD0iNjIuMCIgeT0iMjUyLjAiLz4KICAgICAgICA8YnBtbmRpOkJQTU5MYWJlbCBpZD0iQlBNTkxhYmVsXzEiIGxhYmVsU3R5bGU9IkJQTU5MYWJlbFN0eWxlXzEiPgogICAgICAgICAgPGRjOkJvdW5kcyBoZWlnaHQ9IjQyLjAiIHdpZHRoPSI3OS4wIiB4PSI0MS4wIiB5PSIyODguMCIvPgogICAgICAgIDwvYnBtbmRpOkJQTU5MYWJlbD4KICAgICAgPC9icG1uZGk6QlBNTlNoYXBlPgogICAgICA8YnBtbmRpOkJQTU5TaGFwZSBpZD0iQlBNTlNoYXBlX0VuZEV2ZW50XzEiIGJwbW5FbGVtZW50PSJFbmRFdmVudF8xIj4KICAgICAgICA8ZGM6Qm91bmRzIGhlaWdodD0iMzYuMCIgd2lkdGg9IjM2LjAiIHg9IjM4MS4wIiB5PSIyNTIuMCIvPgogICAgICAgIDxicG1uZGk6QlBNTkxhYmVsIGlkPSJCUE1OTGFiZWxfNCIgbGFiZWxTdHlsZT0iQlBNTkxhYmVsU3R5bGVfMSI+CiAgICAgICAgICA8ZGM6Qm91bmRzIGhlaWdodD0iNDIuMCIgd2lkdGg9Ijc4LjAiIHg9IjM2MC4wIiB5PSIyODguMCIvPgogICAgICAgIDwvYnBtbmRpOkJQTU5MYWJlbD4KICAgICAgPC9icG1uZGk6QlBNTlNoYXBlPgogICAgICA8YnBtbmRpOkJQTU5TaGFwZSBpZD0iQlBNTlNoYXBlX1VzZXJUYXNrXzEiIGJwbW5FbGVtZW50PSJVc2VyVGFza18xIiBpc0V4cGFuZGVkPSJ0cnVlIj4KICAgICAgICA8ZGM6Qm91bmRzIGhlaWdodD0iNTAuMCIgd2lkdGg9IjExMC4wIiB4PSIyMDMuMCIgeT0iMjQ1LjAiLz4KICAgICAgICA8YnBtbmRpOkJQTU5MYWJlbCBpZD0iQlBNTkxhYmVsXzYiIGxhYmVsU3R5bGU9IkJQTU5MYWJlbFN0eWxlXzEiPgogICAgICAgICAgPGRjOkJvdW5kcyBoZWlnaHQ9IjIxLjAiIHdpZHRoPSI5OC4wIiB4PSIyMDkuMCIgeT0iMjU5LjAiLz4KICAgICAgICA8L2JwbW5kaTpCUE1OTGFiZWw+CiAgICAgIDwvYnBtbmRpOkJQTU5TaGFwZT4KICAgICAgPGJwbW5kaTpCUE1ORWRnZSBpZD0iQlBNTkVkZ2VfU2VxdWVuY2VGbG93XzMiIGJwbW5FbGVtZW50PSJTZXF1ZW5jZUZsb3dfMyIgc291cmNlRWxlbWVudD0iQlBNTlNoYXBlX1N0YXJ0RXZlbnRfMSIgdGFyZ2V0RWxlbWVudD0iQlBNTlNoYXBlX1VzZXJUYXNrXzEiPgogICAgICAgIDxkaTp3YXlwb2ludCB4c2k6dHlwZT0iZGM6UG9pbnQiIHg9Ijk4LjAiIHk9IjI3MC4wIi8+CiAgICAgICAgPGRpOndheXBvaW50IHhzaTp0eXBlPSJkYzpQb2ludCIgeD0iMTUwLjAiIHk9IjI3MC4wIi8+CiAgICAgICAgPGRpOndheXBvaW50IHhzaTp0eXBlPSJkYzpQb2ludCIgeD0iMjAzLjAiIHk9IjI3MC4wIi8+CiAgICAgICAgPGJwbW5kaTpCUE1OTGFiZWwgaWQ9IkJQTU5MYWJlbF83Ii8+CiAgICAgIDwvYnBtbmRpOkJQTU5FZGdlPgogICAgICA8YnBtbmRpOkJQTU5FZGdlIGlkPSJCUE1ORWRnZV9TZXF1ZW5jZUZsb3dfNCIgYnBtbkVsZW1lbnQ9IlNlcXVlbmNlRmxvd180IiBzb3VyY2VFbGVtZW50PSJCUE1OU2hhcGVfVXNlclRhc2tfMSIgdGFyZ2V0RWxlbWVudD0iQlBNTlNoYXBlX0VuZEV2ZW50XzEiPgogICAgICAgIDxkaTp3YXlwb2ludCB4c2k6dHlwZT0iZGM6UG9pbnQiIHg9IjMxMy4wIiB5PSIyNzAuMCIvPgogICAgICAgIDxkaTp3YXlwb2ludCB4c2k6dHlwZT0iZGM6UG9pbnQiIHg9IjM0Ny4wIiB5PSIyNzAuMCIvPgogICAgICAgIDxkaTp3YXlwb2ludCB4c2k6dHlwZT0iZGM6UG9pbnQiIHg9IjM4MS4wIiB5PSIyNzAuMCIvPgogICAgICAgIDxicG1uZGk6QlBNTkxhYmVsIGlkPSJCUE1OTGFiZWxfOCIvPgogICAgICA8L2JwbW5kaTpCUE1ORWRnZT4KICAgIDwvYnBtbmRpOkJQTU5QbGFuZT4KICAgIDxicG1uZGk6QlBNTkxhYmVsU3R5bGUgaWQ9IkJQTU5MYWJlbFN0eWxlXzEiPgogICAgICA8ZGM6Rm9udCBuYW1lPSJhcmlhbCIgc2l6ZT0iOS4wIi8+CiAgICA8L2JwbW5kaTpCUE1OTGFiZWxTdHlsZT4KICA8L2JwbW5kaTpCUE1ORGlhZ3JhbT4KPC9icG1uMjpkZWZpbml0aW9ucz4=";
        InputStream mockProcessStream = new ByteArrayInputStream(mockBpmnContent.getBytes(StandardCharsets.UTF_8));
        when(repositoryService.getProcessModel(any())).thenReturn(mockProcessStream);

        when(mapper.map(any(), eq(TaskDTO.class))).thenReturn(taskDTO);

        HistoricTaskInstance hti = mock(HistoricTaskInstance.class);

        when(pemActivitiService.getTaskVariables(anyString())).thenReturn(new HashMap<>());

        Task task = mock(Task.class);
        HistoricProcessInstance historicProcessInstance = mock(HistoricProcessInstance.class);

        when(taskService.createTaskQuery()).thenReturn(taskQuery);
        when(taskQuery.taskId(taskId)).thenReturn(taskQuery);
        when(taskQuery.singleResult()).thenReturn(task);
        when(task.getTaskDefinitionKey()).thenReturn("UserTask_1");

        when(historyService.createHistoricTaskInstanceQuery()).thenReturn(historicTaskInstanceQuery);
        when(historicTaskInstanceQuery.taskId(taskId)).thenReturn(historicTaskInstanceQuery);
        when(historicTaskInstanceQuery.singleResult()).thenReturn(hti);

        when(historyService.createHistoricProcessInstanceQuery()).thenReturn(historicProcessInstanceQuery);
        when(historicProcessInstanceQuery.processInstanceId(anyString())).thenReturn(historicProcessInstanceQuery);
        when(historicProcessInstanceQuery.singleResult()).thenReturn(historicProcessInstance);

        TaskDTO result = pemActivitiService.getUserNodeDetails(taskId);

        assertNotNull(result);
        verify(taskRuntime, times(1)).task(anyString());
        verify(historyService, times(1)).createHistoricProcessInstanceQuery();
        verify(repositoryService, times(1)).getProcessModel(any());
    }

    @Test
    void testGetHistoricUserNodeDetails() throws Exception {
        String taskId = "testTaskId";
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setId(taskId);
        taskDTO.setTaskDefinitionKey("UserTask_1");
        taskDTO.setProcessInstanceId("testProcessInstanceId");
        taskDTO.setFormNodeType(ApplicationConstants.CUSTOM_FORM_NODE);

        UserDetails mockUserDetails = mock(UserDetails.class);
        when(pemUserDetailsService.loadUserByUsername(anyString())).thenReturn(mockUserDetails);

        String mockBpmnContent = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPGJwbW4yOmRlZmluaXRpb25zIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhtbG5zOmJwbW4yPSJodHRwOi8vd3d3Lm9tZy5vcmcvc3BlYy9CUE1OLzIwMTAwNTI0L01PREVMIiB4bWxuczpicG1uZGk9Imh0dHA6Ly93d3cub21nLm9yZy9zcGVjL0JQTU4vMjAxMDA1MjQvREkiIHhtbG5zOmRjPSJodHRwOi8vd3d3Lm9tZy5vcmcvc3BlYy9ERC8yMDEwMDUyNC9EQyIgeG1sbnM6ZGk9Imh0dHA6Ly93d3cub21nLm9yZy9zcGVjL0RELzIwMTAwNTI0L0RJIiB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOmFjdGl2aXRpPSJodHRwOi8vYWN0aXZpdGkub3JnL2JwbW4iIGlkPSJEZWZpbml0aW9uc18xIiBleHBvcnRlcj0ib3JnLmVjbGlwc2UuYnBtbjIubW9kZWxlci5jb3JlIiBleHBvcnRlclZlcnNpb249IjEuNS40LlJDMS12MjAyMjExMTgtMTA0Ny1CMSIgdGFyZ2V0TmFtZXNwYWNlPSJFeGFtcGxlcyI+CiAgPGJwbW4yOnByb2Nlc3MgaWQ9InV0MSIgbmFtZT0idXQxIiBpc0V4ZWN1dGFibGU9InRydWUiPgogICAgPGJwbW4yOnN0YXJ0RXZlbnQgaWQ9IlN0YXJ0RXZlbnRfMSIgbmFtZT0iU3RhcnQgSlMgRXZlbnQiPgogICAgICA8YnBtbjI6b3V0Z29pbmc+U2VxdWVuY2VGbG93XzM8L2JwbW4yOm91dGdvaW5nPgogICAgPC9icG1uMjpzdGFydEV2ZW50PgogICAgPGJwbW4yOmVuZEV2ZW50IGlkPSJFbmRFdmVudF8xIiBuYW1lPSJKUyBFbmQgRXZlbnQiPgogICAgICA8YnBtbjI6aW5jb21pbmc+U2VxdWVuY2VGbG93XzQ8L2JwbW4yOmluY29taW5nPgogICAgPC9icG1uMjplbmRFdmVudD4KICAgIDxicG1uMjp1c2VyVGFzayBpZD0iVXNlclRhc2tfMSIgbmFtZT0iVXNlciBUYXNrIDEiIGFjdGl2aXRpOmFzc2lnbmVlPSJ1c2VyMSI+Cgk8YnBtbjI6ZXh0ZW5zaW9uRWxlbWVudHM+CjxhY3Rpdml0aTpmb3JtUHJvcGVydHkgaWQ9ImZvcm0iIG5hbWU9ImZvcm0iIHR5cGU9InN0cmluZyIgdmFyaWFibGU9InsmcXVvdDtmaWVsZHMmcXVvdDs6W3smcXVvdDtpZCZxdW90OzomcXVvdDsxZjE2MTM5Ni02ODFhLTRhZTgtYjE2Zi00ZjRlNGVkMjgyYWQmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDt0ZXh0aW5wdXQmcXVvdDssJnF1b3Q7bGFiZWxUZXh0JnF1b3Q7OiZxdW90O0VtYWlsJnF1b3Q7LCZxdW90O2hlbHBlclRleHQmcXVvdDs6JnF1b3Q7RW50ZXIgZW1haWwmcXVvdDssJnF1b3Q7bWluJnF1b3Q7OnsmcXVvdDt2YWx1ZSZxdW90OzomcXVvdDszJnF1b3Q7LCZxdW90O21lc3NhZ2UmcXVvdDs6JnF1b3Q7dmFsdWUgc2hvdWxkIGJlIG1pbiAzIGNoYXImcXVvdDt9LCZxdW90O21heCZxdW90Ozp7JnF1b3Q7dmFsdWUmcXVvdDs6JnF1b3Q7NSZxdW90OywmcXVvdDttZXNzYWdlJnF1b3Q7OiZxdW90O3ZhbHVlIHNob3VsZCBiZSBtYXggNSBjaGFyJnF1b3Q7fSwmcXVvdDtpc1JlcXVpcmVkJnF1b3Q7OnsmcXVvdDt2YWx1ZSZxdW90Ozp0cnVlLCZxdW90O21lc3NhZ2UmcXVvdDs6JnF1b3Q7aXNSZXF1aXJlZCZxdW90O319LHsmcXVvdDtpZCZxdW90OzomcXVvdDs2ODIxMjdjMS1mODk0LTQ4OGItOTdkYi01ZDA2YmY4ZGZmODkmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDt0ZXh0YXJlYSZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7VGV4dEFyZWEmcXVvdDt9LHsmcXVvdDtpZCZxdW90OzomcXVvdDsxNDg4ZTk3YS05NzVkLTQ4MjItYjIyMy1mMGIwZmNjZjY2OTgmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDtzZWxlY3QmcXVvdDssJnF1b3Q7bGFiZWxUZXh0JnF1b3Q7OiZxdW90O1NlbGVjdCBGaWxlZCZxdW90O30seyZxdW90O2lkJnF1b3Q7OiZxdW90Ozc0NTAwMTdlLWUxNWEtNDI3OC04NmZhLWJiMDBjNDAwNjliNSZxdW90OywmcXVvdDt0eXBlJnF1b3Q7OiZxdW90O2NoZWNrYm94JnF1b3Q7LCZxdW90O2xhYmVsVGV4dCZxdW90OzomcXVvdDtDaGVjayBCb3gmcXVvdDt9LHsmcXVvdDtpZCZxdW90OzomcXVvdDthNmJjZDBmOS04NDJjLTRmNmYtODhmMS1mMjMyYzJlNTlhMzAmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDtyYWRpbyZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7UmFkaW8mcXVvdDt9LHsmcXVvdDtpZCZxdW90OzomcXVvdDs5NDMxZjc1Ni0xMGMwLTRjYTUtYmFiMS0zYmEyN2QzM2MwYzMmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDt0b2dnbGUmcXVvdDssJnF1b3Q7bGFiZWxUZXh0JnF1b3Q7OiZxdW90O1RvZ2dsZXImcXVvdDt9LHsmcXVvdDtpZCZxdW90OzomcXVvdDszYjZlZDU0Ny1mNDYwLTRlZDctOWNjOS0xYzQ3ZjY0ZTM5ZTcmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDtsaW5rJnF1b3Q7LCZxdW90O2xhYmVsVGV4dCZxdW90OzomcXVvdDtMaW5rJnF1b3Q7fSx7JnF1b3Q7aWQmcXVvdDs6JnF1b3Q7ZWQzZjdiNDktMDI2NS00ZmJlLThkNGEtNmJlMGE5Nzc1OTIyJnF1b3Q7LCZxdW90O3R5cGUmcXVvdDs6JnF1b3Q7ZGF0ZXBpY2tlciZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7RGF0ZSBQaWNrZXImcXVvdDt9LHsmcXVvdDtpZCZxdW90OzomcXVvdDsyOWU2MWE5OC05NjhkLTQzMDMtYjc3Ny0wOTU5OTI3YWVmZTkmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDt0YWImcXVvdDssJnF1b3Q7Y2hpbGRyZW4mcXVvdDs6W3smcXVvdDtpZCZxdW90OzomcXVvdDs0Mzk2OWUxYy0xNDkwLTQ3ZDgtYjc2Ny04NmM4OWJjZTkxYjMmcXVvdDssJnF1b3Q7dGFiVGl0bGUmcXVvdDs6JnF1b3Q7VGFiLTEmcXVvdDssJnF1b3Q7Y2hpbGRyZW4mcXVvdDs6W3smcXVvdDtpZCZxdW90OzomcXVvdDs2YmFmNmRmNy05YTgzLTRlYWQtYmU2NS00NzExZjZhNGY4ODcmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDtyYWRpbyZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7UmFkaW8gQnV0dG9uJnF1b3Q7fV19LHsmcXVvdDtpZCZxdW90OzomcXVvdDtmNjhmNjBkOS00NTM4LTQwNDctODM0My01MDRhOTI3YzhhNjYmcXVvdDssJnF1b3Q7dGFiVGl0bGUmcXVvdDs6JnF1b3Q7dGFiLTImcXVvdDssJnF1b3Q7Y2hpbGRyZW4mcXVvdDs6W3smcXVvdDtpZCZxdW90OzomcXVvdDs0Mzk4OWM2YS0xZThjLTRlNDAtYjAyYi03NDNmNmUwZDM1MzMmcXVvdDssJnF1b3Q7dHlwZSZxdW90OzomcXVvdDt0ZXh0YXJlYSZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7VGV4dCBBcmVhJnF1b3Q7fV19XX0seyZxdW90O2lkJnF1b3Q7OiZxdW90OzZkMTNkYWE0LWRhNDItNGQxNi04NTFkLTJkZjJiMDBmYzhhZiZxdW90OywmcXVvdDt0eXBlJnF1b3Q7OiZxdW90O2J1dHRvbiZxdW90OywmcXVvdDtsYWJlbFRleHQmcXVvdDs6JnF1b3Q7U3VibWl0JnF1b3Q7fV19IiByZWFkYWJsZT0iZmFsc2UiIHdyaXRhYmxlPSJmYWxzZSI+PC9hY3Rpdml0aTpmb3JtUHJvcGVydHk+CjxhY3Rpdml0aTpmb3JtUHJvcGVydHkgaWQ9ImZvcm1Ob2RlVHlwZSIgbmFtZT0iZm9ybU5vZGVUeXBlIiB0eXBlPSJzdHJpbmciIHZhcmlhYmxlPSJDVVNUT01fRk9STV9OT0RFIj48L2FjdGl2aXRpOmZvcm1Qcm9wZXJ0eT4KPC9icG1uMjpleHRlbnNpb25FbGVtZW50cz4KICAgICAgPGJwbW4yOmluY29taW5nPlNlcXVlbmNlRmxvd18zPC9icG1uMjppbmNvbWluZz4KICAgICAgPGJwbW4yOm91dGdvaW5nPlNlcXVlbmNlRmxvd180PC9icG1uMjpvdXRnb2luZz4KICAgIDwvYnBtbjI6dXNlclRhc2s+CiAgICA8YnBtbjI6c2VxdWVuY2VGbG93IGlkPSJTZXF1ZW5jZUZsb3dfMyIgc291cmNlUmVmPSJTdGFydEV2ZW50XzEiIHRhcmdldFJlZj0iVXNlclRhc2tfMSIvPgogICAgPGJwbW4yOnNlcXVlbmNlRmxvdyBpZD0iU2VxdWVuY2VGbG93XzQiIHNvdXJjZVJlZj0iVXNlclRhc2tfMSIgdGFyZ2V0UmVmPSJFbmRFdmVudF8xIi8+CiAgPC9icG1uMjpwcm9jZXNzPgogIDxicG1uZGk6QlBNTkRpYWdyYW0gaWQ9IkJQTU5EaWFncmFtXzEiPgogICAgPGJwbW5kaTpCUE1OUGxhbmUgaWQ9IkJQTU5QbGFuZV8xIiBicG1uRWxlbWVudD0idXQxIj4KICAgICAgPGJwbW5kaTpCUE1OU2hhcGUgaWQ9IkJQTU5TaGFwZV9TdGFydEV2ZW50XzEiIGJwbW5FbGVtZW50PSJTdGFydEV2ZW50XzEiPgogICAgICAgIDxkYzpCb3VuZHMgaGVpZ2h0PSIzNi4wIiB3aWR0aD0iMzYuMCIgeD0iNjIuMCIgeT0iMjUyLjAiLz4KICAgICAgICA8YnBtbmRpOkJQTU5MYWJlbCBpZD0iQlBNTkxhYmVsXzEiIGxhYmVsU3R5bGU9IkJQTU5MYWJlbFN0eWxlXzEiPgogICAgICAgICAgPGRjOkJvdW5kcyBoZWlnaHQ9IjQyLjAiIHdpZHRoPSI3OS4wIiB4PSI0MS4wIiB5PSIyODguMCIvPgogICAgICAgIDwvYnBtbmRpOkJQTU5MYWJlbD4KICAgICAgPC9icG1uZGk6QlBNTlNoYXBlPgogICAgICA8YnBtbmRpOkJQTU5TaGFwZSBpZD0iQlBNTlNoYXBlX0VuZEV2ZW50XzEiIGJwbW5FbGVtZW50PSJFbmRFdmVudF8xIj4KICAgICAgICA8ZGM6Qm91bmRzIGhlaWdodD0iMzYuMCIgd2lkdGg9IjM2LjAiIHg9IjM4MS4wIiB5PSIyNTIuMCIvPgogICAgICAgIDxicG1uZGk6QlBNTkxhYmVsIGlkPSJCUE1OTGFiZWxfNCIgbGFiZWxTdHlsZT0iQlBNTkxhYmVsU3R5bGVfMSI+CiAgICAgICAgICA8ZGM6Qm91bmRzIGhlaWdodD0iNDIuMCIgd2lkdGg9Ijc4LjAiIHg9IjM2MC4wIiB5PSIyODguMCIvPgogICAgICAgIDwvYnBtbmRpOkJQTU5MYWJlbD4KICAgICAgPC9icG1uZGk6QlBNTlNoYXBlPgogICAgICA8YnBtbmRpOkJQTU5TaGFwZSBpZD0iQlBNTlNoYXBlX1VzZXJUYXNrXzEiIGJwbW5FbGVtZW50PSJVc2VyVGFza18xIiBpc0V4cGFuZGVkPSJ0cnVlIj4KICAgICAgICA8ZGM6Qm91bmRzIGhlaWdodD0iNTAuMCIgd2lkdGg9IjExMC4wIiB4PSIyMDMuMCIgeT0iMjQ1LjAiLz4KICAgICAgICA8YnBtbmRpOkJQTU5MYWJlbCBpZD0iQlBNTkxhYmVsXzYiIGxhYmVsU3R5bGU9IkJQTU5MYWJlbFN0eWxlXzEiPgogICAgICAgICAgPGRjOkJvdW5kcyBoZWlnaHQ9IjIxLjAiIHdpZHRoPSI5OC4wIiB4PSIyMDkuMCIgeT0iMjU5LjAiLz4KICAgICAgICA8L2JwbW5kaTpCUE1OTGFiZWw+CiAgICAgIDwvYnBtbmRpOkJQTU5TaGFwZT4KICAgICAgPGJwbW5kaTpCUE1ORWRnZSBpZD0iQlBNTkVkZ2VfU2VxdWVuY2VGbG93XzMiIGJwbW5FbGVtZW50PSJTZXF1ZW5jZUZsb3dfMyIgc291cmNlRWxlbWVudD0iQlBNTlNoYXBlX1N0YXJ0RXZlbnRfMSIgdGFyZ2V0RWxlbWVudD0iQlBNTlNoYXBlX1VzZXJUYXNrXzEiPgogICAgICAgIDxkaTp3YXlwb2ludCB4c2k6dHlwZT0iZGM6UG9pbnQiIHg9Ijk4LjAiIHk9IjI3MC4wIi8+CiAgICAgICAgPGRpOndheXBvaW50IHhzaTp0eXBlPSJkYzpQb2ludCIgeD0iMTUwLjAiIHk9IjI3MC4wIi8+CiAgICAgICAgPGRpOndheXBvaW50IHhzaTp0eXBlPSJkYzpQb2ludCIgeD0iMjAzLjAiIHk9IjI3MC4wIi8+CiAgICAgICAgPGJwbW5kaTpCUE1OTGFiZWwgaWQ9IkJQTU5MYWJlbF83Ii8+CiAgICAgIDwvYnBtbmRpOkJQTU5FZGdlPgogICAgICA8YnBtbmRpOkJQTU5FZGdlIGlkPSJCUE1ORWRnZV9TZXF1ZW5jZUZsb3dfNCIgYnBtbkVsZW1lbnQ9IlNlcXVlbmNlRmxvd180IiBzb3VyY2VFbGVtZW50PSJCUE1OU2hhcGVfVXNlclRhc2tfMSIgdGFyZ2V0RWxlbWVudD0iQlBNTlNoYXBlX0VuZEV2ZW50XzEiPgogICAgICAgIDxkaTp3YXlwb2ludCB4c2k6dHlwZT0iZGM6UG9pbnQiIHg9IjMxMy4wIiB5PSIyNzAuMCIvPgogICAgICAgIDxkaTp3YXlwb2ludCB4c2k6dHlwZT0iZGM6UG9pbnQiIHg9IjM0Ny4wIiB5PSIyNzAuMCIvPgogICAgICAgIDxkaTp3YXlwb2ludCB4c2k6dHlwZT0iZGM6UG9pbnQiIHg9IjM4MS4wIiB5PSIyNzAuMCIvPgogICAgICAgIDxicG1uZGk6QlBNTkxhYmVsIGlkPSJCUE1OTGFiZWxfOCIvPgogICAgICA8L2JwbW5kaTpCUE1ORWRnZT4KICAgIDwvYnBtbmRpOkJQTU5QbGFuZT4KICAgIDxicG1uZGk6QlBNTkxhYmVsU3R5bGUgaWQ9IkJQTU5MYWJlbFN0eWxlXzEiPgogICAgICA8ZGM6Rm9udCBuYW1lPSJhcmlhbCIgc2l6ZT0iOS4wIi8+CiAgICA8L2JwbW5kaTpCUE1OTGFiZWxTdHlsZT4KICA8L2JwbW5kaTpCUE1ORGlhZ3JhbT4KPC9icG1uMjpkZWZpbml0aW9ucz4=";
        InputStream mockProcessStream = new ByteArrayInputStream(mockBpmnContent.getBytes(StandardCharsets.UTF_8));
        when(repositoryService.getProcessModel(any())).thenReturn(mockProcessStream);

        Task task = mock(Task.class);
        HistoricTaskInstance hti = mock(HistoricTaskInstance.class);

        HistoricProcessInstance historicProcessInstance = mock(HistoricProcessInstance.class);

        when(taskService.createTaskQuery()).thenReturn(taskQuery);
        when(taskQuery.taskId(taskId)).thenReturn(taskQuery);
        when(taskQuery.singleResult()).thenReturn(null);
        when(task.getTaskDefinitionKey()).thenReturn("UserTask_1");

        when(historyService.createHistoricTaskInstanceQuery()).thenReturn(historicTaskInstanceQuery);
        when(historicTaskInstanceQuery.taskId(taskId)).thenReturn(historicTaskInstanceQuery);
        when(historicTaskInstanceQuery.singleResult()).thenReturn(hti);

        when(historyService.createHistoricProcessInstanceQuery()).thenReturn(historicProcessInstanceQuery);
        when(historicProcessInstanceQuery.processInstanceId(anyString())).thenReturn(historicProcessInstanceQuery);
        when(historicProcessInstanceQuery.singleResult()).thenReturn(historicProcessInstance);

        HistoricVariableInstanceQuery historicVariableInstanceQuery = mock(HistoricVariableInstanceQuery.class);
        when(historyService.createHistoricVariableInstanceQuery()).thenReturn(historicVariableInstanceQuery);
        when(historicVariableInstanceQuery.processInstanceId(any())).thenReturn(historicVariableInstanceQuery);


        when(mapper.map(any(), eq(TaskDTO.class))).thenReturn(taskDTO);
        List<HistoricVariableInstance> variableInstances = new ArrayList<>();
        HistoricVariableInstance variableInstance1 = mock(HistoricVariableInstance.class);
        when(variableInstance1.getVariableName()).thenReturn("UserTask_1");
        when(variableInstance1.getValue()).thenReturn("value1");
        variableInstances.add(variableInstance1);

        when(historicVariableInstanceQuery.list()).thenReturn(variableInstances);

        when(pemActivitiService.getHistoricProcessVariables(task.getProcessInstanceId())).thenReturn(new HashMap<String, Object>() {{
            put("formData", "This is form data");
        }});

        TaskDTO result = pemActivitiService.getUserNodeDetails(taskId);

        assertNotNull(result);
        verify(taskRuntime, times(1)).task(anyString());
        verify(historyService, times(1)).createHistoricProcessInstanceQuery();
        verify(repositoryService, times(1)).getProcessModel(any());
    }

    @Test
    void StartProcessInstanceByKeyWithVariables_Positive() {
        Map<String, Object> variables = Collections.singletonMap("key", "value");
        when(runtimeService.startProcessInstanceByKey("testKey", variables)).thenReturn(mockProcessInstance);
        String result = pemActivitiService.startProcessInstanceByKey("testKey", variables);
        assertEquals(mockProcessInstance.getProcessInstanceId(), result);
    }

    @Test
    void ClaimTask_Positive() {
        doNothing().when(taskService).claim("testTaskId", "userId");
        pemActivitiService.claimTask("testTaskId", "userId");
        verify(taskService, times(1)).claim("testTaskId", "userId");
    }

    @Test
    void DeleteProcessInstance_Positive() {
        doNothing().when(runtimeService).deleteProcessInstance("instanceId", "Deleted by user");
        pemActivitiService.deleteProcessInstance("instanceId");
        verify(runtimeService, times(1)).deleteProcessInstance("instanceId", "Deleted by user");
    }

    @Test
    void GetTasksForUser_Positive() {
        List<Task> tasks = pemActivitiService.getTasksForUser("user");
        assertFalse(tasks.isEmpty());
        assertEquals(mockTask, tasks.get(0));
    }

    @Test
    void GetTasksForGroup_Positive() {
        List<Task> tasks = pemActivitiService.getTasksForGroup("group");
        assertFalse(tasks.isEmpty());
        assertEquals(mockTask, tasks.get(0));
    }

    @Test
    void GetAllProcessInstances_Positive() {
        List<ProcessInstance> instances = pemActivitiService.getAllProcessInstances();
        assertFalse(instances.isEmpty());
        assertEquals(mockProcessInstance, instances.get(0));
    }

    /*@Test
    void deployProcessDefinition_shouldDeployProcessDefinition() {
        byte[] bpmnData = "<bpmn></bpmn>".getBytes();
        String result = pemActivitiService.deployProcessDefinition("testProcess", bpmnData);
        assertEquals("testProcessKey", result);
        verify(repositoryService, times(1)).createDeployment();
        verify(deploymentBuilder, times(1)).addBytes("testProcess.bpmn", bpmnData);
        verify(deploymentBuilder, times(1)).deploy();
        verify(processDefinitionQuery, times(1)).deploymentId(anyString());
        verify(processDefinitionQuery, times(1)).singleResult();
    }

    @Test
    void deployProcessDefinition_withPath_shouldDeployProcessDefinition() throws IOException {
        String pathToBpmnFile = "D:\\precisely-framework\\pem20\\pem-api\\pem-services\\src\\test\\resources\\Addition.bpmn20.xml";
        InputStream inputStream = new ByteArrayInputStream("<bpmn></bpmn>".getBytes());
        // Mock the file input stream
        when(repositoryService.createDeployment()).thenReturn(deploymentBuilder);
        when(deploymentBuilder.addInputStream(eq(pathToBpmnFile), any(InputStream.class))).thenReturn(deploymentBuilder);
        when(deploymentBuilder.deploy()).thenReturn(deployment);
        when(repositoryService.createProcessDefinitionQuery()).thenReturn(processDefinitionQuery);
        when(processDefinitionQuery.deploymentId(anyString())).thenReturn(processDefinitionQuery);
        when(processDefinitionQuery.singleResult()).thenReturn(processDefinition);
        String result = pemActivitiService.deployProcessDefinition(pathToBpmnFile);
        assertEquals("Addition", result);
        verify(repositoryService, times(1)).createDeployment();
        verify(deploymentBuilder, times(1)).addInputStream(eq(pathToBpmnFile), any(InputStream.class));
        verify(deploymentBuilder, times(1)).deploy();
        verify(processDefinitionQuery, times(1)).deploymentId(anyString());
        verify(processDefinitionQuery, times(1)).singleResult();
    }*/
}
