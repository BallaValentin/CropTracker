package edu.bbte.allamvizsga.dto.response.fieldWork;

import lombok.Data;

import java.util.Collection;
import java.util.List;

@Data
public class GetAffectedRowsDTO {
    public Collection<Boolean> affectedRows;

    public GetAffectedRowsDTO(List<Boolean> list) {
        affectedRows = list;
    }
}
