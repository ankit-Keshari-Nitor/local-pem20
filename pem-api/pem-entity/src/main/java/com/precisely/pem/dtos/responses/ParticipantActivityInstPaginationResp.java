package com.precisely.pem.dtos.responses;

import com.precisely.pem.dtos.shared.PaginationDto;
import com.precisely.pem.dtos.shared.PaginationPcptInstDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantActivityInstPaginationResp {
    private List<ParticipantActivityInstListResp> content;
    private PaginationPcptInstDto pageContent;
}
