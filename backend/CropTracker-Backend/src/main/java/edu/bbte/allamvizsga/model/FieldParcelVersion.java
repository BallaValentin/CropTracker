package edu.bbte.allamvizsga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Polygon;

import java.time.Instant;
import java.util.Map;

@Entity
@Table(name = "field_parcel_version")
@Data
@EqualsAndHashCode(callSuper = true)
public class FieldParcelVersion extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "field_parcel_id", nullable = false)
    private FieldParcel fieldParcel;

    @ManyToOne
    @JoinColumn(name = "cropfield_version_id", nullable = false)
    private CropFieldVersion cropFieldVersion;

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

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public FieldParcelVersion createClone() {
        FieldParcelVersion fieldParcelVersion = new FieldParcelVersion();
        fieldParcelVersion.setFieldParcel(this.getFieldParcel());
        fieldParcelVersion.setCropFieldVersion(this.getCropFieldVersion());
        fieldParcelVersion.setArea(this.getArea());
        fieldParcelVersion.setPolygonColor(this.getPolygonColor());
        fieldParcelVersion.setPolygonPoints(this.getPolygonPoints());
        fieldParcelVersion.setLayoutType(this.getLayoutType());
        fieldParcelVersion.setLayoutParameters(this.layoutParameters);
        fieldParcelVersion.setCropCultivar(this.getCropCultivar());

        return fieldParcelVersion;
    }
}
