package com.precisely.pem.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.precisely.pem.models.ApiConfig;
import com.precisely.pem.repositories.ApiConfigRepo;
import com.precisely.pem.repositories.VchDocContentRepo;
import lombok.extern.log4j.Log4j2;
import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.Expression;
import org.activiti.engine.delegate.JavaDelegate;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.net.MalformedURLException;
import java.net.URL;
import java.sql.Blob;
import java.util.*;


@Service("RestTemplateApiService")
@Log4j2
public class RestTemplateApiService implements JavaDelegate {

    private Expression apiConfiguration;
    private Expression url;
    private Expression method;
    private Expression requestContentType;
    private Expression responseContentType;
    private Expression requestHeaders;
    private Expression request;
    private Expression sampleResponse;
    private Expression response;
    private Expression type;
    private Expression file;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final XmlMapper xmlMapper = new XmlMapper();

    private static final Map<String, String> mimeTypeToExtensionMap = new HashMap<>();
    static {
        mimeTypeToExtensionMap.put("application/json", ".json");
        mimeTypeToExtensionMap.put("text/xml", ".xml");
        mimeTypeToExtensionMap.put("text/csv", ".csv");
        mimeTypeToExtensionMap.put("application/xml", ".xml");
        mimeTypeToExtensionMap.put("image/jpeg", ".jpg");
        mimeTypeToExtensionMap.put("image/png", ".png");
        mimeTypeToExtensionMap.put("text/plain", ".txt");
        mimeTypeToExtensionMap.put("application/pdf", ".pdf");
        mimeTypeToExtensionMap.put("application/zip", ".zip");
        mimeTypeToExtensionMap.put("audio/mpeg", ".mp3");
        mimeTypeToExtensionMap.put("video/mp4", ".mp4");
        mimeTypeToExtensionMap.put("application/octet-stream", ".odt");
    }

    @Override
    @Transactional
    public void execute(DelegateExecution execution) throws Error {
        String serviceTaskId = (String) execution.getCurrentActivityId();
        ApiConfigRepo apiConfigRepo = (ApiConfigRepo) SpringContext.getApiConfigBean();
        VchDocContentRepo vchDocContentRepo = (VchDocContentRepo) SpringContext.getVchDocumentContentBean();

        try {
            String apiURL = (String) url.getValue(execution);
            String apiMethod = (String) method.getValue(execution);
            String apiReqBody = (String) request.getValue(execution);
            String header = (String) requestHeaders.getValue(execution);
            String requestContent = (String) requestContentType.getValue(execution);
            String responseContent = (String) responseContentType.getValue(execution);
            String sampleApiResponse = (String) sampleResponse.getValue(execution);
            String apiConfKey = (String) apiConfiguration.getValue(execution);
            String fileReference = (String) file.getValue(execution);
            String apiUrl = "";
            HttpHeaders apiHeaders = new HttpHeaders();

            ApiConfig apiConfig = null;
            Map<String, Object> apiReq;
            if ("application/xml".equalsIgnoreCase(requestContent)) {
                apiReq = xmlMapper.readValue(apiReqBody, new TypeReference<Map<String, Object>>() {});
            } else {
                apiReq = objectMapper.readValue(apiReqBody, Map.class);
            }
            if (!isValidUrl(apiURL)) {
                if (!apiConfKey.isEmpty()) {
                    apiConfig = apiConfigRepo.findByApiConfigKey(apiConfKey);
                    String protocol = apiConfig.getProtocol();
                    String host = apiConfig.getHost();
                    String port = apiConfig.getPort();

                    StringBuilder aPiURL = new StringBuilder();
                    if(!port.isEmpty()){
                        aPiURL.append(protocol).append("://").append(host).append(":").append(port).append(apiURL);
                    }else{
                        aPiURL.append(protocol).append("://").append(host).append(apiURL);
                    }
                    apiUrl = aPiURL.toString();
                    String userName = apiConfig.getUserName();
                    if(userName != null && !userName.isEmpty()){
                        byte[] base64AuthBytes = Base64.getEncoder().encode(apiConfig.getUserName().getBytes());
                        String base64Auth = new String(base64AuthBytes);
                        apiHeaders.setBasicAuth(base64Auth);
                    }
                }
            } else {
                apiUrl = apiURL;
            }
            apiHeaders = constructHttpHeaders(apiHeaders, header, requestContent, responseContent);

            HttpEntity<?> httpEntity = null;

            if ("application/json".equalsIgnoreCase(requestContent)) {
                String apiReqJson = objectMapper.writeValueAsString(apiReq);
                apiHeaders.setContentType(MediaType.APPLICATION_JSON);
                httpEntity = new HttpEntity<>(apiReqJson, apiHeaders);
            } else if("application/xml".equalsIgnoreCase(requestContent)){
                apiHeaders.setContentType(MediaType.APPLICATION_XML);
                httpEntity = new HttpEntity<>(apiReq, apiHeaders);
            }
            else if ("multipart/form-data".equalsIgnoreCase(requestContent)) {
                MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
                if (!fileReference.isEmpty()) {
                    List<Object[]> results = vchDocContentRepo.findContentTypeAndDocumentContentByDocumentKey(fileReference);
                    if(!results.isEmpty()){
                        for (Object[] result : results) {
                            String contentType = (String) result[0];
                            Blob blobContent = (Blob) result[1];
                            byte[] content = blobContent.getBinaryStream().readAllBytes();
                            String mimeType = mimeTypeToExtensionMap.get(contentType);
                            ByteArrayResource byteArrayResource = new ByteArrayResource(content) {
                                @Override
                                public String getFilename() {
                                    return "uploadedFile"+mimeType;  // Provide a filename for the file
                                }
                            };

                            body.add("file", byteArrayResource);
                        }
                        apiHeaders.setContentType(MediaType.MULTIPART_FORM_DATA);
                    }
                }

                if (apiReq != null && !apiReq.isEmpty()) {
                    body.setAll(apiReq);
                }
                httpEntity = new HttpEntity<>(body, apiHeaders);

            } else {
                throw new IllegalArgumentException("Unsupported request content type: " + requestContent);
            }
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.valueOf(apiMethod.toUpperCase()), httpEntity, String.class);

            if (response != null && response.getBody() != null) {
                Map<String, Object> processVariables = execution.getVariables();
                if (processVariables.isEmpty()) {
                    processVariables = new HashMap<>();
                }
                Map<String, Object> nodeResultData = new HashMap<>();
                if (response.getBody().trim().startsWith("{") || response.getBody().trim().startsWith("[")){
                    objectMapper.configure(SerializationFeature.INDENT_OUTPUT, false);
                    String cleanedResponse = objectMapper.writeValueAsString(response.getBody());
                    nodeResultData.put("response", cleanedResponse);
                } else if (response.getBody().trim().startsWith("<")) {
                    String cleanedResponse = response.getBody()
                            .replaceAll(">\\s+<", "><")  // Remove whitespace between XML tags
                            .replaceAll(">\\s+<", "><")  // Repeat to ensure removal of multiple whitespaces
                            .trim();  // Remove leading and trailing whitespace
                    nodeResultData.put("response", cleanedResponse);
                }else{
                    nodeResultData.put("response",response.getBody());
                }
                processVariables.put(serviceTaskId, nodeResultData);

                execution.setVariables(processVariables);
                log.info(processVariables);
            }
        } catch (IllegalArgumentException | HttpClientErrorException | HttpServerErrorException e) {
            handleHttpException(e);
        } catch (RestClientException | JsonProcessingException e) {
            handleGeneralException(e);
        } catch (Exception e) {
            handleUnexpectedException(e);
        }
    }


    private HttpHeaders constructHttpHeaders(HttpHeaders headers,String header, String requestContent, String responseContent) throws JsonProcessingException {
        List<Map<String, String>> headerList = objectMapper.readValue(header, new TypeReference<List<Map<String, String>>>() {});

        for (Map<String, String> headerMap : headerList) {
            for (Map.Entry<String, String> entry : headerMap.entrySet()) {
                headers.add(entry.getKey(), entry.getValue());
            }
        }

        headers.setAccept(List.of(MediaType.valueOf(responseContent)));

        return headers;
    }

    private boolean isValidUrl(String urlString) {
        try {
            URL url = new URL(urlString);
            return url.getProtocol() != null &&
                    (url.getHost() != null || url.getAuthority() != null) &&
                    url.getPath() != null && !url.getPath().isEmpty();
        } catch (MalformedURLException e) {
            return false;
        }
    }

    private void handleHttpException(RuntimeException e) {
        log.info("HTTP_ERROR: " + e.getMessage());
        throw new BpmnError("HTTP_ERROR", "HTTP Error occurred: " + e.getMessage());
    }

    private void handleGeneralException(Exception e) throws Error {
        log.info("GENERAL_ERROR: " + e.getMessage());
        throw new BpmnError("GENERAL_ERROR", "Error occurred: " + e.getMessage());
    }

    private void handleUnexpectedException(Exception e) throws Error {
        log.info("UNEXPECTED_ERROR: " + e.getMessage());
        throw new BpmnError("UNEXPECTED_ERROR", "Unexpected Error occurred: " + e.getMessage());
    }

}
