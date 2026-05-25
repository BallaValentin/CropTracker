package edu.bbte.allamvizsga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CollectionId;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Polygon;

import java.util.Collection;
import java.util.Map;

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

    @Column(nullable = false)
    private String polygonColor;

    @Column(nullable = false)
    private String layoutType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private Map<String, Object> layoutParameters;

    @ManyToOne
    @JoinColumn(name = "cultivar_id", nullable = false)
    private CropCultivar cropCultivar;
}
