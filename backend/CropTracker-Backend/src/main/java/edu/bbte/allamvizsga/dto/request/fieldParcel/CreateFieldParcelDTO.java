package edu.bbte.allamvizsga.dto.request.fieldParcel;

import edu.bbte.allamvizsga.dto.LatLngObject;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Collection;
import java.util.Map;
import java.util.UUID;

@Data
public class CreateFieldParcelDTO {
    @NotNull(message = "Polygon points cannot be null")
    @Size(min = 3, message = "Polygon must contain at least 4 points")
    private Collection<LatLngObject> polygonPoints;

    private UUID cropFieldId;

    @NotNull(message = "Polygon color cannot be null")
    @NotBlank(message = "Polygon color cannot be blank")
    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "Invalid polygon color hex code")
    private String polygonColor;

    private UUID cropCultivarId;

    @NotNull(message = "Area cannot be null")
    private Double area;

    @NotNull(message = "Layout type cannot be null")
    @NotBlank(message = "Layout type cannot be blank")
    private String layoutType;

    @NotNull(message = "Layout parameters cannot be null")
    private Map<String, Object> layoutParameters;
}
