package com.precisely.pem.dtos;

import lombok.Builder;
import lombok.Data;
import org.activiti.bpmn.model.BpmnModel;

import java.util.List;
import java.util.Map;

import static com.precisely.pem.dtos.Constants.PROCESS_ID_PREFIX;


@Data
public class BpmnConverterRequest {
    Map<String, List<String>> sourceMap;
    Map<String, Connector> connectorsMap;
    BpmnModel bpmnModel;
    private final String processId;

    private BpmnConverterRequest(Builder builder) {
        this.processId = builder.processId;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String processId;

        public Builder processId(String processId) {
            this.processId = PROCESS_ID_PREFIX + processId;
            return this;
        }

        public BpmnConverterRequest build() {
            return new BpmnConverterRequest(this);
        }
    }

}
