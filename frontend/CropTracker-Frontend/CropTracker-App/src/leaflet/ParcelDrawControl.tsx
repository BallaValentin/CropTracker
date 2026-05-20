import { useEffect } from "react";
import { useDrawHandler } from "../hooks/UseDrawHandler";
import type { LatLngObject } from "../interfaces/LatLngObject";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useMap } from "react-leaflet";

interface DrawingToolsProps {
  onPolygonCreated: (polygon: LatLngObject[]) => void;
  onPolygonUpdated: (polygon: LatLngObject[]) => void;
  onPolygonDeleted: () => void;
  polygonColor: string;
  fieldParcels: GetFieldParcelDTO[];
  parentPolygon: LatLngObject[];
  allowCreate: boolean;
  allowDelete: boolean;
}

function FieldParcelDrawControl({
  onPolygonCreated,
  onPolygonDeleted,
  onPolygonUpdated,
  polygonColor,
  fieldParcels,
  parentPolygon,
  allowCreate,
  allowDelete,
}: DrawingToolsProps) {
  const map = useMap();

  const { _onCreated, _onDeleted, _onUpdated } = useDrawHandler({
    onPolygonCreated,
    onPolygonDeleted,
    onPolygonUpdated,
    fieldParcels: fieldParcels,
    parentPolygon: parentPolygon,
  });

  useEffect(() => {
    if (!map) return;

    map.on("pm:create", _onCreated);
    map.on("pm:globaleditmodetoggled", (e) => {
      console.log(e.enabled ? "Toogle enabled" : "Toggle disabled");
      if (!e.enabled) {
        const layersGroup = map.pm.getGeomanLayers(true) as L.FeatureGroup;

        layersGroup.getLayers().forEach((layer) => {
          _onUpdated(layer);
        });
      }
    });
    map.on("pm:remove", _onDeleted);
    map.pm.addControls({
      position: "topright",

      drawMode: allowCreate,
      drawControls: allowCreate,
      editMode: true,
      removalMode: allowDelete,

      drawPolygon: allowCreate,
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
      map.off("pm:globaleditmodetoggled");
      map.off("pm:remove", _onDeleted);
      map.pm.removeControls();
    };
  }, [
    _onCreated,
    _onDeleted,
    _onUpdated,
    allowCreate,
    allowDelete,
    map,
    polygonColor,
    fieldParcels,
    parentPolygon,
  ]);

  return null;
}

export default FieldParcelDrawControl;
