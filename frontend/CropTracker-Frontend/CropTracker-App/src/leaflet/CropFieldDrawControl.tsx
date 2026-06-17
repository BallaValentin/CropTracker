import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { useCropFieldDraw } from "../hooks/UseCropFieldDraw";
import type { LatLngObject } from "../interfaces/LatLngObject";
import L from "leaflet";

interface CropFieldDrawControlProps {
  markerAdded: boolean;
  markerPosition: LatLngObject;
  polygonPoints: LatLngObject[];
  onPolygonCreated: (polygonPoints: LatLngObject[]) => void;
  onPolygonDeleted: () => void;
  onMarkerCreated: (markerPoint: LatLngObject) => void;
  onMarkerDeleted: () => void;
}

function CropFieldDrawControl({
  markerAdded,
  markerPosition,
  polygonPoints,
  onPolygonCreated,
  onPolygonDeleted,
  onMarkerCreated,
  onMarkerDeleted,
}: CropFieldDrawControlProps) {
  const map = useMap();
  const lastPointRef = useRef<L.LatLng | null>(null);
  const tooltipRef = useRef<L.Tooltip | null>(null);

  const { _onCreated, _onDeleted, _onUpdated, _onDrawStart, _onDrawEnd } =
    useCropFieldDraw({
      markerAdded,
      markerPosition,
      polygonPoints,
      onPolygonCreated,
      onPolygonDeleted,
      onMarkerCreated,
      onMarkerDeleted,
      lastPointRef,
      tooltipRef,
    });

  useEffect(() => {
    if (!map || !map.pm) return;

    tooltipRef.current = L.tooltip({
      permanent: true,
      direction: "right",
      className: "distance-tooltip",
    });

    map.on("pm:drawstart", _onDrawStart);
    map.on("pm:drawend", _onDrawEnd);
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

      drawMode: true,
      drawControls: true,
      editMode: true,
      removalMode: true,

      drawPolygon: true,
      drawText: false,
      drawRectangle: false,
      drawCircle: false,
      drawMarker: true,
      drawPolyline: false,
      drawCircleMarker: false,
    });

    map.pm.setGlobalOptions({
      allowSelfIntersection: false,
      tooltips: false,

      templineStyle: { color: "gray" },
      hintlineStyle: { color: "gray", dashArray: "5, 5" },

      pathOptions: {
        interactive: true,
        color: "gray",
        fillColor: "gray",
      },
    });

    return () => {
      map.pm.removeControls();
      map.off("pm:create", _onCreated);
      map.off("pm:globaleditmodetoggled");
      map.off("pm:remove", _onDeleted);
      map.off("pm:drawstart", _onDrawStart);
      map.off("pm:drawend", _onDrawEnd);
    };
  }, [_onCreated, _onUpdated, _onDeleted, map, _onDrawStart, _onDrawEnd]);

  return null;
}

export default CropFieldDrawControl;
