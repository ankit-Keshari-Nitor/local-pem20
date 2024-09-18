package com.precisely.pem.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Rule {
    private String dataType;
    private String lhs;
    private String rhs;
    private String operator;
}
