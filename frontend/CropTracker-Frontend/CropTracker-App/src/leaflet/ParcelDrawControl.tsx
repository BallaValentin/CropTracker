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
  onReferenceRowAdded: (row: LatLngObject[]) => void;
  polygonColor: string;
  fieldParcels: GetFieldParcelDTO[];
  parentPolygon: LatLngObject[];
  selectedParcel: LatLngObject[];
  allowCreate: boolean;
  allowDelete: boolean;
}

function FieldParcelDrawControl({
  onPolygonCreated,
  onPolygonDeleted,
  onPolygonUpdated,
  onReferenceRowAdded,
  polygonColor,
  fieldParcels,
  parentPolygon,
  allowCreate,
  allowDelete,
  selectedParcel,
}: DrawingToolsProps) {
  const map = useMap();

  const { _onCreated, _onDeleted, _onUpdated, _onDrawStart } = useDrawHandler({
    onPolygonCreated,
    onPolygonDeleted,
    onPolygonUpdated,
    onReferenceRowAdded,
    fieldParcels: fieldParcels,
    parentPolygon: parentPolygon,
    selectedParcel,
  });

  useEffect(() => {
    if (!map) return;

    map.on("pm:drawstart", _onDrawStart);
    map.on("pm:create", _onCreated);
    map.on("pm:globaleditmodetoggled", (e) => {
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
      drawPolyline: true,
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

    map.pm.enableDraw("Line", { snappable: false });
    map.pm.disableDraw("Line");

    map.pm.enableDraw("Polygon", { snappable: true });
    map.pm.disableDraw("Polygon");

    return () => {
      map.off("pm:create", _onCreated);
      map.off("pm:drawstart", _onDrawStart);
      map.off("pm:globaleditmodetoggled");
      map.off("pm:remove", _onDeleted);
      map.pm.removeControls();
    };
  }, [
    _onCreated,
    _onDeleted,
    _onUpdated,
    _onDrawStart,
    allowCreate,
    allowDelete,
    map,
    polygonColor,
    fieldParcels,
    parentPolygon,
    selectedParcel,
  ]);

  return null;
}

export default FieldParcelDrawControl;
