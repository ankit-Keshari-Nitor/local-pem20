package com.precisely.pem.dtos.requests;

import com.precisely.pem.Validator.NumericValidator;
import com.precisely.pem.Validator.SpecialCharValidator;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ActivityInstReq {

    private String activityDefnVersionKey;

    @NotNull
    @SpecialCharValidator(fieldName = "name")
    private String name;

    @SpecialCharValidator(fieldName = "description")
    private String description;

    private LocalDateTime alertStartDate;

    @NumericValidator
    private int alertInterval;

    private LocalDateTime dueDate;

    private List<Partners> partners;

    private String contextData;

    private Boolean rolloutInternally;

    private AttributeValues[] attributeValues;

    private AttributeGroups[] attributeGroups;
}
