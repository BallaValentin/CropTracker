package edu.bbte.allamvizsga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Collection;
import java.util.Map;

@Entity
@Table(name = "crop_specie")
@Data
@EqualsAndHashCode(callSuper = true)
public class CropSpecie extends BaseEntity {
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private Map<String, String> commonName;

    private String scientificName;
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private CropCategory cropCategory;

    @OneToMany(mappedBy = "cropSpecie", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<CropCultivar> cropCultivars;
}
