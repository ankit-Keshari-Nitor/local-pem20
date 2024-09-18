package com.precisely.pem.dtos;

public class Constants {
    public static final int HEIGHT = 200;
    public static final int WIDTH = 200;

    public static final int CONNECTOR_X = 100; // decide from center of the source Node
    public static final int CONNECTOR_Y = 100; // decide from center of the source Node

    public static final String PEM_PROCESS_ID = "ID-PEM_TEST_PROCESS";

    public static final int SYSTEM_USER_TASK_POS = 300;
    public static final String SYSTEM_USER_TASK = "SystemUserTaskId";
    public static final String SYSTEM_USER_TASK_NAME = "User Task created by System for Sub Process";

    public static final String SYSTEM_CONNECTOR = "ConnectorTaskId";
    //field name used at Process Level.
    public static final String PROCESS_FIELD_CONTEXT_DATA = "contextData";
    public static final String PROCESS_ID_PREFIX = "ID-";
    public static final String CONNECTOR_ID_PREFIX = "SEQ-ID-";

    //field name used in API Node Handler
    public static final String API_FIELD_URL = "url";
    public static final String API_FIELD_METHOD = "method";
    public static final String API_FIELD_REQUEST_CONTENT_TYPE = "requestContentType";
    public static final String API_FIELD_RESPONSE_CONTENT_TYPE = "responseContentType";
    public static final String API_FIELD_HEADERS = "requestHeaders";
    public static final String API_FIELD_REQUEST_BODY = "request";
    public static final String API_FIELD_SAMPLE_RESPONSE = "sampleResponse";
    public static final String API_FIELD_RESPONSE_BODY = "response";
    public static final String API_FIELD_TYPE = "type";
    public static final String API_FIELD_FILE = "file";
    public static final String API_FIELD_API_CONFIGURATION = "apiConfiguration";
    //field name used in XSLT Node Handler
    public static final String XSLT_FIELD_INPUT = "input";
    public static final String XSLT_FIELD_XSLT = "xslt";
    public static final String XSLT_FIELD_OUTPUT = "output";
    public static final String XSLT_FIELD_SAMPLE_OUTPUT = "sampleOutput";
    public static final String XSLT_FIELD_TYPE = "type";
    public static final String XSLT_FIELD_ESCAPE_INPUT = "escapeInput";

    public static final String EXTENSION_ELEMENT_NAME = "name";

    public static final String COMPLETED = "COMPLETED";
    public static final String IN_PROGRESS = "IN_PROGRESS";
    public static final String SPONSOR_ACTION = "SPONSOR_ACTION";
    public static final String CLOSED = "CLOSED";
    public static final String ERROR = "ERROR";

    public static final String NOT_STARTED = "NOT_STARTED";
    public static final String FORM_NODE_ACTIVE = "FORM_NODE_ACTIVE";
}
