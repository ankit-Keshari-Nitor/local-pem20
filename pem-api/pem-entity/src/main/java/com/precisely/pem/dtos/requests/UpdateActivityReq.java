package com.precisely.pem.dtos.requests;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateActivityReq {
    @Size(max = 80, message = "The length of Activity name must be between 1 and 80 characters ")
    private String name;

    @Size(max = 255, message = "The length of Activity description must be under 255 characters ")
    private String description;
}
