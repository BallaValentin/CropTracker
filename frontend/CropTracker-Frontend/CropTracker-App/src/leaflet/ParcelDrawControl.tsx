import { useEffect } from "react";
import { useDrawHandler } from "../hooks/UseDrawHandler";
import type { LatLngObject } from "../interfaces/LatLngObject";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useMap } from "react-leaflet";

interface DrawingToolsProps {
  onPolygonCreated: (polygon: LatLngObject[]) => void;
  onPolygonDeleted: () => void;
  polygonColor: string;
  fieldParcels: GetFieldParcelDTO[];
  parentPolygon: LatLngObject[];
}

function FieldParcelDrawControl({
  onPolygonCreated,
  onPolygonDeleted,
  polygonColor,
  fieldParcels,
  parentPolygon,
}: DrawingToolsProps) {
  const map = useMap();

  const { _onCreated, _onDeleted } = useDrawHandler({
    onPolygonCreated,
    onPolygonDeleted,
    fieldParcels: fieldParcels,
    parentPolygon: parentPolygon,
  });

  useEffect(() => {
    if (!map) return;

    map.on("pm:create", _onCreated);
    map.on("pm:remove", _onDeleted);
    map.pm.addControls({
      position: "topright",

      drawMode: true,
      drawControls: true,
      editMode: true,
      removalMode: true,

      drawPolygon: true,
      drawText: false,
      drawRectangle: false,
      drawCircle: false,
      drawMarker: false,
      drawPolyline: false,
      drawCircleMarker: false,
    });
    map.pm.setPathOptions({
      color: polygonColor,
    });
    map.pm.setGlobalOptions({
      snappable: true,
      snapDistance: 20,
      allowSelfIntersection: false,
      requireContainment: [],
    });

    return () => {
      map.off("pm:create", _onCreated);
      map.off("pm:remove", _onDeleted);
      map.pm.removeControls();
    };
  }, [_onCreated, _onDeleted, map, polygonColor, fieldParcels, parentPolygon]);

  return null;
}

export default FieldParcelDrawControl;
