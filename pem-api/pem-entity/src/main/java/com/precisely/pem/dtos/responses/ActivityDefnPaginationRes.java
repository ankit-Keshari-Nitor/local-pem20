package com.precisely.pem.dtos.responses;

import com.precisely.pem.dtos.shared.PaginationDto;
import com.precisely.pem.dtos.shared.ActivityDefnDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityDefnPaginationRes {
    private List<ActivityDefnListResp> content;
    private PaginationDto pageContent;
}
