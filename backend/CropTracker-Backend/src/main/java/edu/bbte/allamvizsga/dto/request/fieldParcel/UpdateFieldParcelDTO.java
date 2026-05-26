package edu.bbte.allamvizsga.dto.request.fieldParcel;

import edu.bbte.allamvizsga.dto.LatLngObject;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.Collection;
import java.util.Map;

@Data
public class UpdateFieldParcelDTO {
    private Collection<LatLngObject> polygonPoints;
    @NotNull(message = "Crop field id cannot be null")
    @NotBlank(message = "Crop field id cannot be blank")
    private String cropFieldId;
    @NotNull(message = "Crop cultivar id cannot be null")
    @NotBlank(message = "Crop cultivar id cannot be blank")
    private String cropCultivarId;
    @NotNull(message = "Area cannot be null")
    private Double area;
    @NotNull(message = "Polygon color cannot be null")
    @NotBlank(message = "Polygon color cannot be blank")
    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "Invalid polygon color hex code")
    private String polygonColor;
    @NotNull(message = "Layout type cannot be null")
    @NotBlank(message = "Layout type cannot be null")
    private String layoutType;
    @NotNull(message = "Layout parameters cannot be null")
    private Map<String, Object> layoutParameters;
}
