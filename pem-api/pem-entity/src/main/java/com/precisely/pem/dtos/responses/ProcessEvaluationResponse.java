package com.precisely.pem.dtos.responses;
import lombok.Data;

import java.util.List;


@Data
public class ProcessEvaluationResponse {
    private List<Result> processEvaluationResult;

    @Data
    public static class Result {
        private String path;
        private Object value;
    }
}

