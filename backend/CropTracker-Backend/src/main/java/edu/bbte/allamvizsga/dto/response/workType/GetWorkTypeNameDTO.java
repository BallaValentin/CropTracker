package edu.bbte.allamvizsga.dto.response.workType;

import lombok.Data;

import java.util.UUID;

@Data
public class GetWorkTypeNameDTO {
    private UUID uid;
    private String name;
}
