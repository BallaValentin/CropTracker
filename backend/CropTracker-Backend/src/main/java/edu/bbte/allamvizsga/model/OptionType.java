package edu.bbte.allamvizsga.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class OptionType {
    private String optionName;
    private Double conversionRate;

    public OptionType(String optionName, double conversionRate) {
        this.optionName = optionName;
        this.conversionRate = conversionRate;
    }
}
