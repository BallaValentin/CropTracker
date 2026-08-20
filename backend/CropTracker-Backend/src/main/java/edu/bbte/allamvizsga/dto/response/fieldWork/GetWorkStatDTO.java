package edu.bbte.allamvizsga.dto.response.fieldWork;

import lombok.Data;

import java.util.Map;
import java.util.UUID;

@Data
public class GetWorkStatDTO {
    private UUID uid;
    private UUID cropFieldVersionId;
    private UUID cropFieldId;
    private UUID workTypeId;
    private String workTypeName;
    private String workTiming;
    private String startDate;
    private String endDate;
    private Map<String, Object> parameters;
}
