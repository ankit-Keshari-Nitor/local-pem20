package com.precisely.pem.dtos.responses;

import com.precisely.pem.dtos.shared.PaginationDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPaginationResponse {

    private List<UserResponse> content;
    private PaginationDto pageContent;
}

