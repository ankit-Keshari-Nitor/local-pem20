package com.precisely.pem.dtos.shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OwnerDetailsDto {
    public String ownerName;
    public String ownerEmail;
}
