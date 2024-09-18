package com.precisely.pem.dtos.shared;

import lombok.Data;

import java.util.Date;

@Data
public class ActivityTaskDto {
    public String id;
    public String name;
    public String description;
    public String status;
    public Date completedDate;
    public String completedBy;
    public String form;//schema
    public String formData;//draft data
    public String formNodeType;
}
