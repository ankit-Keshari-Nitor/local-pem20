package com.precisely.pem.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PemProcess {
    private List<Node> nodes;
    private List<Connector> connectors;
    private String contextData;
}
