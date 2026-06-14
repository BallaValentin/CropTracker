import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useCropFieldDraw } from "../hooks/UseCropFieldDraw";
import type { LatLngObject } from "../interfaces/LatLngObject";

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

  const { _onCreated, _onDeleted, _onUpdated } = useCropFieldDraw({
    markerAdded,
    markerPosition,
    polygonPoints,
    onPolygonCreated,
    onPolygonDeleted,
    onMarkerCreated,
    onMarkerDeleted,
  });

  useEffect(() => {
    if (!map) return;

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
      tooltips: true,

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
    };
  }, [_onCreated, _onUpdated, _onDeleted, map]);

  return null;
}

export default CropFieldDrawControl;
