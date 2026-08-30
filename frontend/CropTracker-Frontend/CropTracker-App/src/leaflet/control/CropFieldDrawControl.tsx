import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useCropFieldDraw } from "../../hooks/leaflet/UseCropFieldDraw";
import type { LatLngObject } from "../../interfaces/helper/LatLngObject";
import L from "leaflet";
import { useMapDistance } from "../../hooks/leaflet/UseMapDistance";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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

  const { _onDrawStart, _onDrawEnd } = useMapDistance();

  useEffect(() => {
    if (!map || !map.pm) return;

    map.pm.setLang(
      "custom-en" as Parameters<typeof map.pm.setLang>[0],
      {
        buttonTitles: {
          drawPolyButton: t(
            "leaflet.control.cropFieldDrawControl.buttonTitles.drawPolyButton",
            { defaultValue: "Draw crop field outline" },
          ),
          editButton: t(
            "leaflet.control.cropFieldDrawControl.buttonTitles.editButton",
            { defaultValue: "Edit crop field" },
          ),
          deleteButton: t(
            "leaflet.control.cropFieldDrawControl.buttonTitles.deleteButton",
            { defaultValue: "Remove crop field outline" },
          ),
          drawMarkerButton: t(
            "leaflet.control.cropFieldDrawControl.buttonTitles.drawMarkerButton",
            { defaultValue: "Set crop field marker" },
          ),
        },
        actions: {
          finish: t("leaflet.control.cropFieldDrawControl.actions.finish", {
            defaultValue: "Finish",
          }),
          removeLastVertex: t(
            "leaflet.control.cropFieldDrawControl.actions.removeLastVertex",
            {
              defaultValue: "Remove last point",
            },
          ),
          cancel: t("leaflet.control.cropFieldDrawControl.actions.cancel", {
            defaultValue: "Cancel",
          }),
          reset: t("leaflet.control.cropFieldDrawControl.actions.reset", {
            defaultValue: "Reset",
          }),
          clear: t("leaflet.control.cropFieldDrawControl.actions.clear", {
            defaultValue: "Clear",
          }),
        },
      },
      "en",
    );
  }, [map, t]);

  useEffect(() => {
    if (!map || !map.pm) return;

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
      rotateMode: false,
      dragMode: false,
      removalMode: true,

      drawPolygon: true,
      cutPolygon: false,
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
