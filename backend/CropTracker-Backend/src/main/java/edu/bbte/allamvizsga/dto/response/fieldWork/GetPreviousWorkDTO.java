package edu.bbte.allamvizsga.dto.response.fieldWork;

import lombok.Data;

import java.util.Collection;
import java.util.UUID;

@Data
public class GetPreviousWorkDTO {
    private UUID uid;
    private String cropFieldName;
    private String workTypeName;
    private String workTiming;
    private String startDate;
    private String endDate;
    private Collection<Boolean> affectedRows;
}
