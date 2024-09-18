package com.precisely.pem.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SetOwnerRequest {
    @NotBlank(message = "userKey is Required.")
    private String userKey;
    @NotBlank(message = "roleKey is Required.")
    private String roleKey;
}
