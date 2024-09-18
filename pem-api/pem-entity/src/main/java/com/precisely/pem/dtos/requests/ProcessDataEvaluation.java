package com.precisely.pem.dtos.requests;

import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@XmlRootElement(name = "processDataEvaluation")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProcessDataEvaluation {

    private List<String> paths;

}


