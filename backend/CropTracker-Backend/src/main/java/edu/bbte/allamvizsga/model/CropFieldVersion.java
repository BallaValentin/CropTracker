package edu.bbte.allamvizsga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.locationtech.jts.geom.Polygon;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collection;

@Entity
@Table(name = "cropfield_version")
@Data
@EqualsAndHashCode(callSuper = true)
public class CropFieldVersion extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "cropfield_id", nullable = false)
    private CropField cropField;

    @OneToMany(mappedBy = "cropFieldVersion", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<FieldParcelVersion> fieldParcelVersions;

    @Column(precision = 18, scale = 15)
    private BigDecimal latitude;

    @Column(precision = 18, scale = 15)
    private BigDecimal longitude;

    @Column(columnDefinition = "POLYGON")
    private Polygon polygonPoints;

    @Column(nullable = false)
    private Double area;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public CropFieldVersion createClone() {
        CropFieldVersion cropFieldVersion = new CropFieldVersion();
        cropFieldVersion.setCropField(this.getCropField());
        cropFieldVersion.setArea(this.getArea());
        cropFieldVersion.setLatitude(this.getLatitude());
        cropFieldVersion.setLongitude(this.getLongitude());
        cropFieldVersion.setPolygonPoints(this.getPolygonPoints());

        return cropFieldVersion;
    }
}
