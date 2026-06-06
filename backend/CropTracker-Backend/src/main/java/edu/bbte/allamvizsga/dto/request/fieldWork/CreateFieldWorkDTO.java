package edu.bbte.allamvizsga.dto.request.fieldWork;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Collection;
import java.util.Map;

@Data
public class CreateFieldWorkDTO {

    @NotBlank(message = "Crop field id cannot be blank")
    private String cropFieldId;

    @NotBlank(message = "Work type id cannot be blank")
    private String workTypeId;

    @NotBlank(message = "Work timing cannot be blank")
    private String workTiming;

    @NotBlank(message = "Start date cannot be blank")
    private String startDate;

    private String endDate;

    @NotNull(message = "Work parameters cannot be null")
    private Map<String, Object> parameters;

    @NotNull(message = "Affected rows cannot be null")
    private Collection<Boolean> affectedRows;

    @NotNull(message = "Field parcel ids cannot be null")
    private Collection<String> fieldParcelIds;
}
