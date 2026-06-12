package edu.bbte.allamvizsga.mappers.util;

import edu.bbte.allamvizsga.dto.LatLngObject;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.geom.PrecisionModel;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class PolygonMapper {
    @Named("toPolygon")
    public Polygon mapPointsToPolygon(Collection<LatLngObject> polygonPoints) {
        if (polygonPoints == null || polygonPoints.size() < 3) {
            return null;
        }

        List<Coordinate> coords = new java.util.ArrayList<>(polygonPoints.stream().map(point ->
                new Coordinate(Double.parseDouble(String.valueOf(point.getLng())),
                        Double.parseDouble(String.valueOf(point.getLat())))).toList());

        if (!coords.getFirst().equals2D(coords.getLast())) {
            coords.add(new Coordinate(coords.getFirst().x, coords.getFirst().y));
        }

        return new GeometryFactory(new PrecisionModel(), 4326)
                .createPolygon(coords.toArray(new Coordinate[0]));
    }

    @Named("fromPolygon")
    public Collection<LatLngObject> mapPolygonToPoints(Polygon polygon) {
        if (polygon == null || polygon.isEmpty()) {
            return Collections.emptyList();
        }

        Coordinate[] coords = polygon.getCoordinates();

        return Arrays.stream(coords)
                .map(coordinate -> new LatLngObject(
                        BigDecimal.valueOf(coordinate.y), BigDecimal.valueOf(coordinate.x)))
                .collect(Collectors.toList());
    }
}
