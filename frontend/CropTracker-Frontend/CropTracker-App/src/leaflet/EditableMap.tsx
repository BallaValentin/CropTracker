import { type DrawEvents } from "leaflet";
import { blueCircleIcon } from "../elements/icons/BlueCircleIcon";
import { EditControl } from "react-leaflet-draw";
import CustomLayers from "./CustomLayers";
import { Paper } from "@mui/material";
import ChangeView from "./ChangeView";
import {
  LayersControl,
  MapContainer,
  Marker,
  Polygon,
  Tooltip,
  useMap,
  FeatureGroup,
} from "react-leaflet";
import type { GetCropFieldData } from "../interfaces/response/GetCropFieldData";
import { useEffect, useState } from "react";
import L from "leaflet";
import {
  calculatePolygonArea,
  getPolygonCenter,
  isPointInPolygon,
} from "../utils/PolygonHelper";
import { defaultMapPosition } from "../utils/Constants";

interface EditableMapProps {
  cropField: GetCropFieldData;
  markerAdded: boolean;
  onMarkerCreated: (latLng: L.LatLng) => void;
  onMarkerDeleted: () => void;
  onPolygonCreated: (latLngs: L.LatLng[]) => void;
  onPolygonDeleted: () => void;
}

function EditableMap({
  cropField,
  markerAdded,
  onMarkerCreated,
  onMarkerDeleted,
  onPolygonCreated,
  onPolygonDeleted,
}: EditableMapProps) {
  const [cropFieldData, setCropFieldData] =
    useState<GetCropFieldData>(cropField);
  const [viewCenter, setViewCenter] = useState<[number, number]>(
    cropField.markerPosition
      ? [cropField.markerPosition.lat, cropField.markerPosition.lng]
      : [defaultMapPosition.lat, defaultMapPosition.lng],
  );

  useEffect(() => {
    setCropFieldData(cropField);
  }, [cropField]);

  const DrawingTools = () => {
    const map = useMap();

    const _onCreated = (e: DrawEvents.Created) => {
      const { layer, layerType } = e;
      const currentZoom = map.getZoom();
      const currentCenter = map.getCenter();

      map.fire("draw:drawstop");

      if (layerType === "polygon") {
        const polygonLayer = layer as L.Polygon;
        const rawLatLngs = polygonLayer.getLatLngs();
        const latLngs = rawLatLngs[0] as L.LatLng[];
        const formattedPoints = latLngs.map((latLng) => ({
          lat: latLng.lat,
          lng: latLng.lng,
        }));

        if (
          !markerAdded ||
          (cropFieldData.markerPosition &&
            isPointInPolygon(cropFieldData.markerPosition, formattedPoints))
        ) {
          setCropFieldData((prev) => ({
            ...prev,
            polygonPoints: formattedPoints,
            area: calculatePolygonArea(formattedPoints),
          }));
          onPolygonCreated(latLngs);

          if (!markerAdded) {
            const centerMarker = getPolygonCenter(formattedPoints);
            setCropFieldData((prev) => ({
              ...prev,
              markerPosition: centerMarker,
            }));

            setViewCenter([centerMarker.lat, centerMarker.lng]);

            const centerLatLng = new L.LatLng(
              centerMarker.lat,
              centerMarker.lng,
            );
            console.log("Center LatLng: ", centerLatLng);
            onMarkerCreated(centerLatLng);
          }
        } else {
          alert(
            "The polygon must contain the marker. Please draw a polygon that includes the marker.",
          );
        }
      } else if (layerType === "marker") {
        const markerLayer = layer as L.Marker;
        const rawLatLng = markerLayer.getLatLng();

        if (
          cropFieldData.polygonPoints.length === 0 ||
          isPointInPolygon(rawLatLng, cropFieldData.polygonPoints)
        ) {
          setCropFieldData((prev) => ({
            ...prev,
            markerPosition: {
              lat: rawLatLng.lat,
              lng: rawLatLng.lng,
            },
          }));
          setViewCenter(
            cropField.markerPosition
              ? [cropField.markerPosition.lat, cropField.markerPosition.lng]
              : [defaultMapPosition.lat, defaultMapPosition.lng],
          );
          onMarkerCreated(rawLatLng);
        } else {
          alert(
            "The marker must be placed inside the polygon. Please place the marker within the existing polygon.",
          );
        }
      }

      setTimeout(() => {
        layer.remove();
        map.setView(currentCenter, currentZoom, { animate: false });
      }, 10);
    };

    const _onDeleted = (e: DrawEvents.Deleted) => {
      const { layers } = e;
      const currentZoom = map.getZoom();
      const currentCenter = map.getCenter();

      layers.eachLayer((layer) => {
        if (layer instanceof L.Polygon) {
          setCropFieldData((prev) => ({
            ...prev,
            polygonPoints: [],
            area: 0,
          }));
          onPolygonDeleted();
        } else if (layer instanceof L.Marker) {
          setCropFieldData((prev) => ({
            ...prev,
            markerPosition: defaultMapPosition,
          }));
          onMarkerDeleted();
        }
      });

      setTimeout(() => {
        map.setView(currentCenter, currentZoom, { animate: false });
      }, 10);
    };

    return (
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={_onCreated}
          onDeleted={_onDeleted}
          draw={{
            marker: true,
            polyline: false,
            circle: false,
            rectangle: false,
            circlemarker: false,
            polygon: {
              allowIntersection: false,
              showLength: true,
              metric: true,
              drawError: {
                color: "#e1e100",
                message: "<strong>Error:<strong> shape edges cannot intersect!",
              },
              icon: blueCircleIcon,
              shapeOptions: {
                clickable: true,
                color: "#3388FF",
              },
            },
          }}
        />
        {markerAdded && cropFieldData.markerPosition && (
          <Marker
            key={
              cropFieldData.uid
                ? "marker-" + cropFieldData.uid
                : "default-marker"
            }
            position={[
              cropFieldData.markerPosition.lat,
              cropFieldData.markerPosition.lng,
            ]}
          />
        )}

        {cropFieldData.polygonPoints.length > 0 && (
          <Polygon
            key={
              cropFieldData.uid
                ? "polygon-" + cropFieldData.uid
                : "default-polygon"
            }
            positions={cropFieldData.polygonPoints}
            pathOptions={{ color: "blue" }}
            eventHandlers={{
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({ fillOpacity: 0.7 });
                layer.openTooltip();
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({ fillOpacity: 0.2 });
                layer.closeTooltip();
              },
            }}
          >
            <Tooltip direction="top" className="area-tooltip" opacity={1}>
              Area: {(cropField.area / 10000).toFixed(2)} ha
            </Tooltip>
          </Polygon>
        )}
      </FeatureGroup>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        mt: 2,
        mb: 2,
        height: 600,
        width: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <MapContainer style={{ height: "100%" }} center={viewCenter} zoom={13}>
        <LayersControl position="topright">
          <CustomLayers />

          <ChangeView center={viewCenter} zoom={16} />

          <LayersControl.Overlay checked name="Draw tools">
            <DrawingTools />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </Paper>
  );
}

export default EditableMap;
