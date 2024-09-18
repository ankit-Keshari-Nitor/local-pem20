package com.precisely.pem.dtos.requests;

import com.precisely.pem.Validator.MultipartFileValidator;
import com.precisely.pem.Validator.SpecialCharValidator;
import com.precisely.pem.enums.Application;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ActivityDefnReq {
    @NotNull
    @SpecialCharValidator(fieldName = "name")
    @Size(max = 80)
    private String name;

    @SpecialCharValidator(fieldName = "description")
    @Size(max = 255)
    private String description;

    @NotNull
    @MultipartFileValidator
    private MultipartFile file;

    @NotNull
    private Application application;
}
