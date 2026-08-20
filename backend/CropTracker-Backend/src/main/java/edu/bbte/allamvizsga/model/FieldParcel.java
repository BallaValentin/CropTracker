package edu.bbte.allamvizsga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CollectionId;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.locationtech.jts.geom.Polygon;

import java.time.Instant;
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

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Boolean isActive;

    @Column
    @OneToMany(mappedBy = "fieldParcel", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<FieldParcelVersion> fieldParcelVersions;
}
