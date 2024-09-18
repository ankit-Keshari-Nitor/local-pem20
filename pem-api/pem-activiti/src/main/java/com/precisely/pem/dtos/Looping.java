package com.precisely.pem.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Looping {
    private String loopCardinality;
    private String loopDataInput;
    private String dataItem;
    private String completionCondition;
}
