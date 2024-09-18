package com.precisely.pem.Validator;

import com.precisely.pem.enums.Status;

import java.util.List;
import java.util.stream.Collectors;

public class StatusEnumValidator {
    public static List<String> validateStatuses(List<String> statuses){
        return statuses.stream()
                .filter(StatusEnumValidator::isValidStatus)
                .collect(Collectors.toList());
    }

    public static boolean isValidStatus(String status){
        try{
            Status.valueOf(status);
            return true;
        }catch (Exception e){
            return false;
        }
    }
}
