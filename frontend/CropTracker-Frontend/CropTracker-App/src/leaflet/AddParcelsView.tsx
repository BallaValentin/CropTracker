import { Box } from "@mui/material";
import { LayersControl, MapContainer, Polygon } from "react-leaflet";
import type { LatLngObject } from "../interfaces/LatLngObject";
import { defaultMapPosition } from "../utils/Constants";
import CustomLayers from "./CustomLayers";
import { useState } from "react";
import FieldParcelDrawControl from "./ParcelDrawControl";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import L from "leaflet";

interface AddParcelViewProps {
  polygonPoints: LatLngObject[];
  parcelPolygonPoints: LatLngObject[];
  markerPosition: LatLngObject | null;
  uid: string;
  mapHeight: number;
  polygonColor: string;
  onParcelAdded: (latLngs: LatLngObject[]) => void;
  onParcelDeleted: () => void;
  fieldParcels: GetFieldParcelDTO[];
}

function AddParcelView({
  mapHeight,
  markerPosition,
  uid,
  polygonPoints,
  polygonColor,
  onParcelAdded,
  onParcelDeleted,
  parcelPolygonPoints,
  fieldParcels,
}: AddParcelViewProps) {
  const [parcelCreated, setParcelCreated] = useState<boolean>(
    parcelPolygonPoints.length != 0,
  );

  const onPolygonCreated = (latLngs: LatLngObject[]) => {
    setParcelCreated(true);
    onParcelAdded(latLngs);
  };

  const onPolygonDeleted = () => {
    setParcelCreated(false);
    onParcelDeleted();
  };

  return (
    <>
      <Box
        sx={{
          height: mapHeight,
          width: "100%",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        <MapContainer
          key={`${markerPosition?.lat}-${markerPosition?.lng}`}
          center={
            markerPosition != null
              ? [markerPosition.lat, markerPosition.lng]
              : [defaultMapPosition.lat, defaultMapPosition.lng]
          }
          zoom={13}
          scrollWheelZoom={true}
          dragging={true}
          zoomControl={true}
          style={{ height: "100%", width: "100%" }}
        >
          <FieldParcelDrawControl
            onPolygonCreated={onPolygonCreated}
            onPolygonDeleted={onPolygonDeleted}
            polygonColor={polygonColor}
            fieldParcels={fieldParcels}
            parentPolygon={polygonPoints}
          />

          <LayersControl position="topright">
            <CustomLayers />
          </LayersControl>

          {parcelCreated && (
            <Polygon
              key={"new field parcel"}
              positions={parcelPolygonPoints}
              pathOptions={{ color: polygonColor }}
            />
          )}

          {fieldParcels.map((parcel) => (
            <Polygon
              key={parcel.uid}
              positions={parcel.polygonPoints}
              pathOptions={{ color: parcel.polygonColor || "blue" }}
              eventHandlers={{
                add: (e) => {
                  const layer = e.target;
                  layer.options.pmIgnore = true;
                  if (layer.pm) {
                    L.PM.reInitLayer(layer);
                  }
                },
              }}
            />
          ))}

          <Polygon
            key={uid ? "polygon-" + uid : "default-polygon"}
            positions={polygonPoints}
            pathOptions={{ color: "gray" }}
            eventHandlers={{
              add: (e) => {
                const layer = e.target;
                layer.options.pmIgnore = true;
                if (layer.pm) {
                  L.PM.reInitLayer(layer);
                }
              },
            }}
          />
        </MapContainer>
      </Box>
    </>
  );
}

export default AddParcelView;
