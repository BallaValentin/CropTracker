package edu.bbte.allamvizsga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.locationtech.jts.geom.Polygon;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collection;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "cropfield")
@Data
public class CropField extends BaseEntity {
    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column
    @OneToMany(mappedBy = "cropField", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<FieldParcel> fieldParcels;

    @Column(precision = 18, scale = 15)
    private BigDecimal latitude;

    @Column(precision = 18, scale = 15)
    private BigDecimal longitude;

    @Column(columnDefinition = "POLYGON")
    private Polygon polygonPoints;

    @Column(nullable = false)
    private Boolean isDeleted;

    @Column(nullable = false)
    private Double area;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
}
