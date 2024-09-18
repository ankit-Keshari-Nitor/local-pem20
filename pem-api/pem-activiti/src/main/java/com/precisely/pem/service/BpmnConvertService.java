package com.precisely.pem.service;

import com.precisely.pem.converter.NodeHandler;
import com.precisely.pem.dtos.BpmnConverterRequest;
import com.precisely.pem.exceptionhandler.BpmnConverterException;
import com.precisely.pem.exceptionhandler.SchemaValidationException;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.Process;
import org.springframework.core.io.InputStreamResource;

import javax.xml.stream.XMLStreamException;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;

public interface BpmnConvertService {
    Blob getBpmnConvertedBlob(InputStream is,BpmnConverterRequest bpmnConverterRequest) throws IOException, SQLException, BpmnConverterException, SchemaValidationException;
    byte[] getBpmnConvertedInbyte(InputStream is,BpmnConverterRequest bpmnConverterRequest) throws IOException, SQLException, BpmnConverterException, SchemaValidationException;

    NodeHandler createNodeHandlerChain();
    InputStreamResource getPemBpmnJsonData(Blob activityDefnData) throws SQLException, XMLStreamException, IOException;
    BpmnModel getBpmnModel(Blob activityDefnData) throws SQLException, XMLStreamException;
    String getContextDataFromProcess(Process process);

}
