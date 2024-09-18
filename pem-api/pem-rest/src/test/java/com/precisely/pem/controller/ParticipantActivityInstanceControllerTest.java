package com.precisely.pem.controller;
import com.precisely.pem.dtos.shared.ActivityTaskDto;
import com.precisely.pem.dtos.responses.BaseResourceResp;
import com.precisely.pem.dtos.responses.MessageResp;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.services.ParticipantActivityInstService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
public class ParticipantActivityInstanceControllerTest {
    @Mock
    private ParticipantActivityInstService participantActivityInstService;
    @InjectMocks
    private ParticipantActivityInstanceController participantActivityInstanceController;
    private MessageResp messageResp;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        messageResp = MessageResp.builder().response("SUCCESS").build();
    }

    @Test
    public void testStartActivity_Success() throws Exception {
        when(participantActivityInstService.startActivity(anyString(), anyString())).thenReturn(messageResp);
        ResponseEntity<Object> response = participantActivityInstanceController.startActivity("testSponsorContext", "testPcptActivityInstKey");
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(messageResp, response.getBody());
    }

    @Test
    public void testStartActivity_NotFound() throws Exception {
        when(participantActivityInstService.startActivity(anyString(), anyString()))
                .thenThrow(new ResourceNotFoundException("PcptInstanceNotFound", "The participant instance with key 'testPcptActivityInstKey' not found."));
        Exception exception = null;
        try {
            participantActivityInstanceController.startActivity("testSponsorContext", "testPcptActivityInstKey");
        } catch (ResourceNotFoundException e) {
            exception = e;
        }
        assertEquals("The participant instance with key 'testPcptActivityInstKey' not found.", exception.getMessage());
    }

    @Test
    public void testGetTaskDetails() throws Exception{
        ActivityTaskDto dto = new ActivityTaskDto();
        when(participantActivityInstService.getNodeDetails(anyString(),anyString(),anyString())).thenReturn(dto);
        ResponseEntity<ActivityTaskDto> response = participantActivityInstanceController.getNodeDetails("testSponsorContext","pcptActivityInstKey","taskKey");
        assertEquals(HttpStatus.OK,response.getStatusCode());
    }

    @Test
    public void testSaveTask() throws Exception{
        BaseResourceResp obj = new BaseResourceResp("Success", LocalDateTime.now().toString());
        when(participantActivityInstService.completeNode(anyString(),anyString(),anyString(),anyString(),anyBoolean())).thenReturn(obj);
        ResponseEntity<BaseResourceResp> response = participantActivityInstanceController.submitNode("testSponsorContext","pcptActivityInstKey","taskKey","{\"fields\":[{\"id\":\"1f161396-681a-4ae8-b16f-4f4e4ed282ad\",\"type\":\"textinput\",\"labelText\":\"Email\",\"helperText\":\"Enter email\",\"min\":{\"value\":\"3\",\"message\":\"value should be min 3 char\"},\"max\":{\"value\":\"5\",\"message\":\"value should be max 5 char\"},\"isRequired\":{\"value\":true,\"message\":\"isRequired\"}},{\"id\":\"682127c1-f894-488b-97db-5d06bf8dff89\",\"type\":\"textarea\",\"labelText\":\"TextArea\"},{\"id\":\"1488e97a-975d-4822-b223-f0b0fccf6698\",\"type\":\"select\",\"labelText\":\"Select Filed\"},{\"id\":\"7450017e-e15a-4278-86fa-bb00c40069b5\",\"type\":\"checkbox\",\"labelText\":\"Check Box\"},{\"id\":\"a6bcd0f9-842c-4f6f-88f1-f232c2e59a30\",\"type\":\"radio\",\"labelText\":\"Radio\"},{\"id\":\"9431f756-10c0-4ca5-bab1-3ba27d33c0c3\",\"type\":\"toggle\",\"labelText\":\"Toggler\"},{\"id\":\"3b6ed547-f460-4ed7-9cc9-1c47f64e39e7\",\"type\":\"link\",\"labelText\":\"Link\"},{\"id\":\"ed3f7b49-0265-4fbe-8d4a-6be0a9775922\",\"type\":\"datepicker\",\"labelText\":\"Date Picker\"},{\"id\":\"29e61a98-968d-4303-b777-0959927aefe9\",\"type\":\"tab\",\"children\":[{\"id\":\"43969e1c-1490-47d8-b767-86c89bce91b3\",\"tabTitle\":\"Tab-1\",\"children\":[{\"id\":\"6baf6df7-9a83-4ead-be65-4711f6a4f887\",\"type\":\"radio\",\"labelText\":\"Radio Button\"}]},{\"id\":\"f68f60d9-4538-4047-8343-504a927c8a66\",\"tabTitle\":\"tab-2\",\"children\":[{\"id\":\"43989c6a-1e8c-4e40-b02b-743f6e0d3533\",\"type\":\"textarea\",\"labelText\":\"Text Area\"}]}]},{\"id\":\"6d13daa4-da42-4d16-851d-2df2b00fc8af\",\"type\":\"button\",\"labelText\":\"Submit\"}]}");
        assertEquals("Success",response.getBody().getStatus());
    }

    @Test
    public void testSubmitTask() throws Exception{
        BaseResourceResp obj = new BaseResourceResp("Success", LocalDateTime.now().toString());
        when(participantActivityInstService.completeNode(anyString(),anyString(),anyString(),anyString(),anyBoolean())).thenReturn(obj);
        ResponseEntity<BaseResourceResp> response = participantActivityInstanceController.submitNode("testSponsorContext","pcptActivityInstKey","taskKey","{\"fields\":[{\"id\":\"1f161396-681a-4ae8-b16f-4f4e4ed282ad\",\"type\":\"textinput\",\"labelText\":\"Email\",\"helperText\":\"Enter email\",\"min\":{\"value\":\"3\",\"message\":\"value should be min 3 char\"},\"max\":{\"value\":\"5\",\"message\":\"value should be max 5 char\"},\"isRequired\":{\"value\":true,\"message\":\"isRequired\"}},{\"id\":\"682127c1-f894-488b-97db-5d06bf8dff89\",\"type\":\"textarea\",\"labelText\":\"TextArea\"},{\"id\":\"1488e97a-975d-4822-b223-f0b0fccf6698\",\"type\":\"select\",\"labelText\":\"Select Filed\"},{\"id\":\"7450017e-e15a-4278-86fa-bb00c40069b5\",\"type\":\"checkbox\",\"labelText\":\"Check Box\"},{\"id\":\"a6bcd0f9-842c-4f6f-88f1-f232c2e59a30\",\"type\":\"radio\",\"labelText\":\"Radio\"},{\"id\":\"9431f756-10c0-4ca5-bab1-3ba27d33c0c3\",\"type\":\"toggle\",\"labelText\":\"Toggler\"},{\"id\":\"3b6ed547-f460-4ed7-9cc9-1c47f64e39e7\",\"type\":\"link\",\"labelText\":\"Link\"},{\"id\":\"ed3f7b49-0265-4fbe-8d4a-6be0a9775922\",\"type\":\"datepicker\",\"labelText\":\"Date Picker\"},{\"id\":\"29e61a98-968d-4303-b777-0959927aefe9\",\"type\":\"tab\",\"children\":[{\"id\":\"43969e1c-1490-47d8-b767-86c89bce91b3\",\"tabTitle\":\"Tab-1\",\"children\":[{\"id\":\"6baf6df7-9a83-4ead-be65-4711f6a4f887\",\"type\":\"radio\",\"labelText\":\"Radio Button\"}]},{\"id\":\"f68f60d9-4538-4047-8343-504a927c8a66\",\"tabTitle\":\"tab-2\",\"children\":[{\"id\":\"43989c6a-1e8c-4e40-b02b-743f6e0d3533\",\"type\":\"textarea\",\"labelText\":\"Text Area\"}]}]},{\"id\":\"6d13daa4-da42-4d16-851d-2df2b00fc8af\",\"type\":\"button\",\"labelText\":\"Submit\"}]}");
        assertEquals("Success",response.getBody().getStatus());
    }
}
