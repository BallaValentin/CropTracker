package edu.bbte.allamvizsga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Collection;

@Entity
@Table(name = "crop_category")
@Data
@EqualsAndHashCode(callSuper = true)
public class CropCategory extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String categoryName;
    @OneToMany(mappedBy = "cropCategory", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true
    )
    private Collection<CropSpecie> cropSpecies;

    public CropCategory(String categoryName) {
        this.setCategoryName(categoryName);
    }

    public CropCategory() {

    }

}
