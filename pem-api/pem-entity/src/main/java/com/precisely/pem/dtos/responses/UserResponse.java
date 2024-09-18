package com.precisely.pem.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    public String email;
    public String firstName;
    public String lastName;
    public String mobilePhone;
    public String userKey;
    public String userName;
    public String status;
}
