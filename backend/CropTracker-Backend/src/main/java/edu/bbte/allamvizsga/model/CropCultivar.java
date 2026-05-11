package edu.bbte.allamvizsga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.validator.constraints.Range;

import java.util.Collection;

@Entity
@Table(name = "crop_cultivar")
@Data
@EqualsAndHashCode(callSuper = true)
public class CropCultivar extends BaseEntity {
    @Column(nullable = false)
    private String cultivarName;
    @ManyToOne
    @JoinColumn(name = "specie_id", nullable = false)
    private CropSpecie cropSpecie;
    private Integer daysToMaturity;
    @Range(min = 1, max = 10)
    private Integer droughtTolerance;
    private Double idealPhRange;

    @Column
    @OneToMany(mappedBy = "cropCultivar", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<FieldParcel> fieldParcels;
}
