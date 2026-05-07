package edu.bbte.allamvizsga.mappers;

import edu.bbte.allamvizsga.dto.LatLngObject;
import edu.bbte.allamvizsga.dto.request.CreateCropFieldDTO;
import edu.bbte.allamvizsga.dto.request.UpdateCropFieldDTO;
import edu.bbte.allamvizsga.dto.response.GetCropFieldDTO;
import edu.bbte.allamvizsga.model.CropField;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.geom.PrecisionModel;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class CropFieldMapper {
    @Mapping(target = "polygonPoints", source = "polygonPoints", qualifiedByName = "toPolygon")
    public abstract CropField createPlotDTOtoModel(CreateCropFieldDTO createCropFieldDTO);

    @AfterMapping
    protected void afterCreateDTOMapping(CreateCropFieldDTO createCropFieldDTO, @MappingTarget CropField cropField) {
        if (createCropFieldDTO.getMarkerPosition() != null) {
            cropField.setLatitude(createCropFieldDTO.getMarkerPosition().getLat());
            cropField.setLongitude(createCropFieldDTO.getMarkerPosition().getLng());
        }
    }

    @Mapping(target = "polygonPoints", source = "polygonPoints", qualifiedByName = "fromPolygon")
    public abstract GetCropFieldDTO modelToGetCropFieldDTO(CropField cropField);

    @AfterMapping
    protected void afterCropFieldMapping(CropField cropField, @MappingTarget GetCropFieldDTO getCropFieldDTO) {
        if (cropField.getLatitude() != null && cropField.getLongitude() != null) {
            getCropFieldDTO.setMarkerPosition(new LatLngObject(cropField.getLatitude(), cropField.getLongitude()));
        }
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "polygonPoints", ignore = true)
    public abstract void updateModelFromUpdatePlotDto(UpdateCropFieldDTO updateCropFieldDTO, @MappingTarget CropField cropField);

    @AfterMapping
    protected void afterUpdateDTOMapping(UpdateCropFieldDTO updateCropFieldDTO, @MappingTarget CropField cropField) {
        cropField.setPolygonPoints(mapPointsToPolygon(updateCropFieldDTO.getPolygonPoints()));
        if (updateCropFieldDTO.getMarkerPosition() != null) {
            cropField.setLatitude(updateCropFieldDTO.getMarkerPosition().getLat());
            cropField.setLongitude(updateCropFieldDTO.getMarkerPosition().getLng());
        }
    }

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
