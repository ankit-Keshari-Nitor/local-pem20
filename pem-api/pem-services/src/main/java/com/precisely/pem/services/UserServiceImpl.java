package com.precisely.pem.services;

import com.precisely.pem.commonUtil.PaginationRequest;
import com.precisely.pem.dtos.requests.UserRequest;
import com.precisely.pem.dtos.responses.SponsorInfo;
import com.precisely.pem.dtos.responses.UserPaginationResponse;
import com.precisely.pem.dtos.responses.UserResponse;
import com.precisely.pem.dtos.shared.PaginationDto;
import com.precisely.pem.exceptionhandler.ResourceNotFoundException;
import com.precisely.pem.models.Participant;
import com.precisely.pem.repositories.CompanyUserRepo;
import com.precisely.pem.repositories.ParticipantCustomRepo;
import com.precisely.pem.repositories.ParticipantRepo;
import com.precisely.pem.repositories.SponsorRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private SponsorRepo sponsorRepo;

    @Autowired
    private CompanyUserRepo companyUserRepo;

    @Autowired
    private ParticipantRepo participantRepo;

    //TODO will change once identity server code is present
    @Value("${participant-key}")
    private String participantKey;

    @Autowired
    ParticipantCustomRepo participantCustomRepo;

    @Override
    public SponsorInfo getActiveSponsorNameBySponsorContext(String sponsorContext){
        return sponsorRepo.getActiveSponsorInfoBySponsorContext(sponsorContext);
    }

    @Override
    public UserPaginationResponse findUsers(UserRequest userRequest, PaginationRequest pageReq) throws ResourceNotFoundException {

        if (validatePartnerKey(userRequest,participantKey)){
            throw new ResourceNotFoundException("InvalidPartnerKey","Partner Key provided is not authorized to view.");
        }
        Sort sort = pageReq.getSortDir().equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(pageReq.getSortBy()).ascending()
                : Sort.by(pageReq.getSortBy()).descending();
        Pageable pageable = PageRequest.of(pageReq.getPageNo(), pageReq.getPageSize(), sort);

        Page<UserResponse> userResponses = participantCustomRepo.findUsers(userRequest,pageable);

        return UserPaginationResponse.builder().content(userResponses.getContent())
                .pageContent(PaginationDto.builder()
                        .totalElements(userResponses.getTotalElements())
                        .size(userResponses.getSize())
                        .number(userResponses.getNumber())
                        .totalPages(userResponses.getTotalPages())
                        .build()).build();
    }

    private boolean validatePartnerKey(UserRequest userRequest,String participantKey) {
        //TODO refactor this when Identity server is integrated, we will get Participant object , we can remove findById
        Optional<Participant> participant = participantRepo.findById(participantKey);
        if (participant.isPresent() && participant.get().getIsSponsorUser().equalsIgnoreCase("n")){
            boolean validation = participant.get().getPartnerKey().equalsIgnoreCase(userRequest.getPartnerKey());
            userRequest.setPartnerKey(participant.get().getPartnerKey());
            return validation;
        }
        return false;
    }
}
