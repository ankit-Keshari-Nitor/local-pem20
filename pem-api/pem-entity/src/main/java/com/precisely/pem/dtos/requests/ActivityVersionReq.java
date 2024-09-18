package com.precisely.pem.dtos.requests;

import com.precisely.pem.Validator.MultipartFileValidator;
import com.precisely.pem.Validator.SpecialCharValidator;
import com.precisely.pem.enums.Application;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ActivityVersionReq {

    private Boolean isEncrypted;

    @NotNull
    @MultipartFileValidator
    private MultipartFile file;

    @NotNull
    private Application application;

    @NotNull
    @SpecialCharValidator(fieldName = "description")
    private String description;
}
