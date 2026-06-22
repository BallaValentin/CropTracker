package edu.bbte.allamvizsga.dto.response.fieldWork;

import lombok.Data;

import java.util.Collection;

@Data
public class GetPreviousWorkDTO {
    private String workTypeName;
    private String workTiming;
    private String startDate;
    private String endDate;
    private Collection<Boolean> affectedRows;
}
