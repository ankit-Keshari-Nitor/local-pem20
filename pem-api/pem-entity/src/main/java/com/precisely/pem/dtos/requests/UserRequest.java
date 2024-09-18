package com.precisely.pem.dtos.requests;

import com.precisely.pem.commonUtil.PaginationRequest;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class UserRequest extends PaginationRequest {
    private String sponsorKey;
    private String partnerKey;
    private String participantRole;
    private String userExternalId;
    private String participantStatus;
    private String userKey;
    private String userName;
    private String firstName;
    private String lastName;
    private String email;
}
