package com.precisely.pem.dtos.shared;

import lombok.Data;

import java.io.Serializable;

@Data
public class ActivityDefnPaginationDto implements Serializable {
    private ActivityDefnDto vchActivityDefinitionDto;
    private  PaginationDto paginationDto;
}
