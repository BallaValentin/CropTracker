package edu.bbte.allamvizsga.dto.request.fieldParcel;

import edu.bbte.allamvizsga.dto.LatLngObject;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Collection;
import java.util.UUID;

@Data
public class CreateFieldParcelDTO {
    @NotNull(message = "Polygon points cannot be null")
    private Collection<LatLngObject> polygonPoints;
    @NotNull(message = "Crop field id cannot be null")
    private UUID cropFieldId;
}
