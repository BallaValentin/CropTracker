package edu.bbte.allamvizsga.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.TimeZoneColumn;
import org.hibernate.annotations.TimeZoneStorage;
import org.hibernate.annotations.TimeZoneStorageType;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "field_work")
@Data
@EqualsAndHashCode(callSuper = true)
public class FieldWork extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "cropfield_id", nullable = false)
    private CropField cropField;

    @ManyToOne
    @JoinColumn(name = "worktypes_id", nullable = false)
    private WorkType workType;

    private String workTiming;

    @TimeZoneStorage(TimeZoneStorageType.NATIVE)
    private OffsetDateTime startDate;

    @TimeZoneStorage(TimeZoneStorageType.NATIVE)
    private OffsetDateTime endDate;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private Map<String, Object> parameters;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private Collection<Boolean> affectedRows;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private Collection<UUID> fieldParcelIds;

    private Boolean isActive;
}
