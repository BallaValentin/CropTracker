package edu.bbte.allamvizsga.dto.response.fieldWork;

import edu.bbte.allamvizsga.model.CropField;
import edu.bbte.allamvizsga.model.WorkTypes;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;

@Data
public class GetFieldWorkDTO {
    private UUID uid;
    private UUID cropFieldId;
    private UUID workTypeId;
    private String workTypeName;
    private String workTiming;
    private String startDate;
    private String endDate;
    private Map<String, Object> parameters;
    private Collection<Boolean> affectedRows;
    private Collection<UUID> fieldParcelIds;
}
