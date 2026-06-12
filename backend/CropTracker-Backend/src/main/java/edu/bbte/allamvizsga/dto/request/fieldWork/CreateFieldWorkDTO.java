package edu.bbte.allamvizsga.dto.request.fieldWork;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.Collection;
import java.util.Map;

@Data
public class CreateFieldWorkDTO {
    private static final String INSTANT_REGEX =
            "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}(:[0-9]{2})?(\\.\\d{1,9})?Z$";

    @NotBlank(message = "Crop field id cannot be blank")
    private String cropFieldId;

    @NotBlank(message = "Work type id cannot be blank")
    private String workTypeId;

    @NotBlank(message = "Work timing cannot be blank")
    private String workTiming;

    @NotBlank(message = "Start date cannot be blank")
    @Pattern(regexp = INSTANT_REGEX,
            message = "Start date must match ISO-8601 Instant format")
    private String startDate;

    @Pattern(regexp = "^$|" + INSTANT_REGEX,
            message = "End date must be blank or match ISO-8601 Instant format")
    private String endDate;

    @NotNull(message = "Work parameters cannot be null")
    private Map<String, Object> parameters;

    @NotNull(message = "Affected rows cannot be null")
    private Collection<Boolean> affectedRows;

    @NotNull(message = "Field parcel ids cannot be null")
    private Collection<String> fieldParcelIds;
}
