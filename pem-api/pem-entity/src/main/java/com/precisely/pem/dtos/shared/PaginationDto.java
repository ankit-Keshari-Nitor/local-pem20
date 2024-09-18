package com.precisely.pem.dtos.shared;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaginationDto implements Serializable {
    private int number;
    private int size;
    private long totalElements;
    private int totalPages;
}
