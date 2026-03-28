package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.LatLngObject;
import edu.bbte.allamvizsga.dto.request.CreatePlotDTO;
import edu.bbte.allamvizsga.dto.request.UpdatePlotDTO;
import edu.bbte.allamvizsga.dto.response.GetPlotDTO;
import edu.bbte.allamvizsga.model.Plot;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.geom.PrecisionModel;
import org.mapstruct.*;

import java.lang.reflect.Array;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class PlotMapper {
    @Mapping(target = "polygonPoints", source = "polygonPoints", qualifiedByName = "toPolygon")
    public abstract Plot createPlotDTOtoModel(CreatePlotDTO createPlotDTO);

    @Mapping(target = "polygonPoints", source = "polygonPoints", qualifiedByName = "fromPolygon")
    public abstract GetPlotDTO modelToGetPlotDTO(Plot plot);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract void updateModelFromUpdatePlotDto(UpdatePlotDTO updatePlotDTO, @MappingTarget Plot plot);

    @Named("toPolygon")
    protected Polygon mapPointsToPolygon(Collection<LatLngObject> polygonPoints) {
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
    protected Collection<LatLngObject> mapPolygonToPoints(Polygon polygon) {
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
