package com.precisely.pem.dtos.requests;

import com.precisely.pem.Validator.MultipartFileValidator;
import com.precisely.pem.Validator.SpecialCharValidator;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateActivityVersionReq {
    private Boolean isEncrypted;

    @MultipartFileValidator
    private MultipartFile file;

    @SpecialCharValidator
    @Size(max = 255)
    private String description;
}
