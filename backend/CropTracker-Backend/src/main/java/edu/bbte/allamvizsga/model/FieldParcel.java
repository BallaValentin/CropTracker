package edu.bbte.allamvizsga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.locationtech.jts.geom.Polygon;

import java.util.Collection;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "field_parcel")
@Data
public class FieldParcel extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "cropfield_id", nullable = false)
    private CropField cropField;

    @Column(columnDefinition = "POLYGON")
    private Polygon polygonPoints;

    @Column(nullable = false)
    private Double area;

    @ManyToOne
    @JoinColumn(name = "cultivar_id", nullable = false)
    private CropCultivar cropCultivar;
}
