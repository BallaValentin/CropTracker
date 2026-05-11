package edu.bbte.allamvizsga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Collection;

@Entity
@Table(name = "crop_specie")
@Data
@EqualsAndHashCode(callSuper = true)
public class CropSpecie extends BaseEntity {
    @Column(nullable = false)
    private String commonName;
    private String scientificName;
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private CropCategory cropCategory;

    @OneToMany(mappedBy = "cropSpecie", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<CropCultivar> cropCultivars;
}
