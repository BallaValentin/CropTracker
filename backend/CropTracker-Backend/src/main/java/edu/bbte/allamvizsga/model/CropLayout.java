package edu.bbte.allamvizsga.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "crop_layout")
@Data
@EqualsAndHashCode(callSuper = true)
public class CropLayout extends  BaseEntity {
    private String layoutName;

    public CropLayout() {

    }

    public CropLayout(String layoutName) {
        this.layoutName = layoutName;
    }
}
