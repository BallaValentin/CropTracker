package edu.bbte.allamvizsga.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Objects;

@Data
public class LatLngObject {
    private final BigDecimal lat;
    private final BigDecimal lng;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        LatLngObject that = (LatLngObject) o;

        return getLat().compareTo(that.getLat()) == 0 &&
                getLng().compareTo(that.getLng()) == 0;
    }

    @Override
    public int hashCode() {
        return Objects.hash(lat.stripTrailingZeros(), lng.stripTrailingZeros());
    }
}
