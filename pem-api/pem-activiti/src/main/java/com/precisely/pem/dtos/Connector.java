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
public class Connector {
    private String id;
    private String source;
    private String target;
    private String condition;
    private String parent;
    private List<Diagram> diagram;
}
