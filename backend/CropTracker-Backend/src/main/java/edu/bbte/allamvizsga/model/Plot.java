package edu.bbte.allamvizsga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.locationtech.jts.geom.Polygon;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name="plot")
@Data
public class Plot extends BaseEntity{
    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @Column(nullable = false)
    private BigDecimal latitude;

    @Column(nullable = false)
    private BigDecimal longitude;
    
    @Column(columnDefinition = "POLYGON")
    private Polygon polygonPoints;

    @Column(nullable = false)
    private Boolean isDeleted;

    @Column(nullable = false)
    private Double area;
}
