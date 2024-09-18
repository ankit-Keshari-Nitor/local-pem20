package com.precisely.pem.dtos.responses;

import com.precisely.pem.dtos.shared.PaginationDto;
import com.precisely.pem.dtos.shared.ActivityStatsDto;
import lombok.Data;

import java.util.List;

@Data
public class ActivityInstPagnResp {
    List<ActivityInstListResp> content;
    PaginationDto page;
}
