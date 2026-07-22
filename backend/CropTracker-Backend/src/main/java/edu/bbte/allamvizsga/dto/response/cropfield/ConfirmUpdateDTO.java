package edu.bbte.allamvizsga.dto.response.cropfield;

import lombok.Data;

@Data
public class ConfirmUpdateDTO {
    private Boolean confirmationRequired;
    private Integer numberOfOngoing;
    private Integer numberOfScheduled;

    public ConfirmUpdateDTO() {
        this.confirmationRequired = Boolean.TRUE;
    }

    public ConfirmUpdateDTO(int ongoingWorks, int scheduledWorks) {
        this.confirmationRequired = Boolean.TRUE;
        this.numberOfOngoing = ongoingWorks;
        this.numberOfScheduled = scheduledWorks;
    }
}
