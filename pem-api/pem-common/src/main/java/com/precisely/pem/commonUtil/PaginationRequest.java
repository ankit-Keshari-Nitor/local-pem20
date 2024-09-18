package com.precisely.pem.commonUtil;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PaginationRequest {
    private Integer pageNo;
    private Integer pageSize;
    private String sortBy;
    private String sortDir;
}
