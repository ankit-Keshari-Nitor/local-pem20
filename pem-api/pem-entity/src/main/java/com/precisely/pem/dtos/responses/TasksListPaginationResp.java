package com.precisely.pem.dtos.responses;

import com.precisely.pem.dtos.shared.PaginationDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TasksListPaginationResp {
    private List<TasksListResp> content;
    private PaginationDto pageContent;
}
