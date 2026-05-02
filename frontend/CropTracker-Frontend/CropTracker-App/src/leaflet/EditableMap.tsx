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
import type { Plot } from "../interfaces/Plot";
import { useEffect, useState } from "react";
import L from "leaflet";
import { calculateArea } from "../utils/CalculatePlotArea";

interface EditableMapProps {
  plot: Plot;
  markerAdded: boolean;
  onMarkerCreated: (latLng: L.LatLng) => void;
  onPolygonCreated: (latLngs: L.LatLng[]) => void;
}

function EditableMap({
  plot,
  markerAdded,
  onMarkerCreated,
  onPolygonCreated,
}: EditableMapProps) {
  const [plotData, setPlotData] = useState<Plot>(plot);

  useEffect(() => {
    setPlotData(plot);
  }, [plot]);

  const DrawingTools = ({
    onPolygonCreated,
    onMarkerCreated,
  }: {
    onPolygonCreated: (latLngs: L.LatLng[]) => void;
    onMarkerCreated: (latLng: L.LatLng) => void;
  }) => {
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
        setPlotData((prev) => ({
          ...prev,
          polygonPoints: formattedPoints,
          area: calculateArea(formattedPoints),
        }));

        onPolygonCreated(latLngs);
      } else if (layerType === "marker") {
        const markerLayer = layer as L.Marker;
        const rawLatLng = markerLayer.getLatLng();
        setPlotData((prev) => ({
          ...prev,
          latitude: rawLatLng.lat,
          longitude: rawLatLng.lng,
        }));
        onMarkerCreated(rawLatLng);
      }

      setTimeout(() => {
        layer.remove();
        map.setView(currentCenter, currentZoom, { animate: false });
      }, 10);
    };

    return (
      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={_onCreated}
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
        {markerAdded && (
          <Marker
            key={crypto.randomUUID()}
            position={[plotData.latitude, plotData.longitude]}
          />
        )}

        {plotData.polygonPoints.length > 0 && (
          <Polygon
            key={crypto.randomUUID()}
            positions={plotData.polygonPoints}
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
              Area: {(plot.area / 10000).toFixed(2)} ha
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
      <MapContainer
        style={{ height: "100%" }}
        center={[plotData.latitude, plotData.longitude]}
        zoom={13}
      >
        <LayersControl position="topright">
          <CustomLayers />

          <ChangeView
            center={[plotData.latitude, plotData.longitude]}
            zoom={16}
          />

          <LayersControl.Overlay checked name="Draw tools">
            <DrawingTools
              onPolygonCreated={onPolygonCreated}
              onMarkerCreated={onMarkerCreated}
            />
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </Paper>
  );
}

export default EditableMap;
