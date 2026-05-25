import { Box } from "@mui/material";
import { LayersControl, MapContainer, Polygon, Polyline } from "react-leaflet";
import type { LatLngObject } from "../interfaces/LatLngObject";
import { defaultMapPosition, referenceLineId } from "../utils/Constants";
import CustomLayers from "./CustomLayers";
import { useEffect, useRef, useState } from "react";
import FieldParcelDrawControl from "./ParcelDrawControl";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import L from "leaflet";
import {
  getGeneratedCrops,
  getGeneratedRectabgles,
  getGeneratedRows,
} from "../utils/GenerateShapesUtil";

interface AddParcelViewProps {
  polygonPoints: LatLngObject[];
  parcelPolygonPoints: LatLngObject[];
  markerPosition: LatLngObject | null;
  uid: string;
  mapHeight: number;
  polygonColor: string;
  onParcelAdded: (latLngs: LatLngObject[]) => void;
  onParcelUpdated: (latLngs: LatLngObject[]) => void;
  onParcelDeleted: () => void;
  fieldParcels: GetFieldParcelDTO[];
  allowCreate: boolean;
  allowDelete: boolean;
  bedSpacing: number;
  rowWidth: number;
  rowSpacing: number;
  cropSpacing: number;
  rowMargin: number;
  numberOfRows: number;
}

function AddParcelView({
  mapHeight,
  markerPosition,
  uid,
  polygonPoints,
  polygonColor,
  onParcelAdded,
  onParcelUpdated,
  onParcelDeleted,
  parcelPolygonPoints,
  fieldParcels,
  allowCreate,
  allowDelete,
  bedSpacing,
  rowWidth,
  rowSpacing,
  cropSpacing,
  rowMargin,
  numberOfRows,
}: AddParcelViewProps) {
  const [parcelCreated, setParcelCreated] = useState<boolean>(
    parcelPolygonPoints.length != 0,
  );
  const [referenceRow, setReferenceRow] = useState<LatLngObject[]>([]);
  const [rows, setRows] = useState<LatLngObject[][]>([]);
  const [rowRectangles, setRowRectangles] = useState<LatLngObject[][]>([]);
  const [cropCoords, setCropCoords] = useState<LatLngObject[]>([]);

  useEffect(() => {
    setRows(
      getGeneratedRows(
        parcelPolygonPoints,
        referenceRow,
        numberOfRows,
        bedSpacing + rowWidth / 2,
      ) || [],
    );
  }, [referenceRow, parcelPolygonPoints, bedSpacing, rowWidth, numberOfRows]);

  useEffect(() => {
    setRowRectangles(getGeneratedRectabgles(rows, rowWidth));
  }, [rows, rowWidth]);

  useEffect(() => {
    setCropCoords(
      getGeneratedCrops(rows, rowWidth, rowMargin, rowSpacing, cropSpacing),
    );
  }, [cropSpacing, rowMargin, rowSpacing, rowWidth, rows]);

  const onPolygonCreated = (latLngs: LatLngObject[]) => {
    setParcelCreated(true);
    onParcelAdded(latLngs);
  };

  const onPolygonUpdated = (latLngs: LatLngObject[]) => {
    onParcelUpdated(latLngs);
  };

  const onPolygonDeleted = () => {
    setParcelCreated(false);
    onParcelDeleted();
  };

  const handleReferenceRowAdded = (refRow: LatLngObject[]) => {
    console.log("Reference row added or modified");
    setReferenceRow(refRow);
  };

  const parentPolygonRef = useRef<L.Polygon | null>(null);

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
            onPolygonUpdated={onPolygonUpdated}
            polygonColor={polygonColor}
            fieldParcels={fieldParcels}
            parentPolygon={polygonPoints}
            allowCreate={allowCreate}
            allowDelete={allowDelete}
            onReferenceRowAdded={handleReferenceRowAdded}
            onReferenceRowUpdated={handleReferenceRowAdded}
            selectedParcel={parcelPolygonPoints}
            referenceRow={referenceRow}
            rows={rows}
            rowRectangles={rowRectangles}
            crops={cropCoords}
          />

          <LayersControl position="topright">
            <CustomLayers />
          </LayersControl>

          <Polygon
            key={uid ? "polygon-" + uid : "default-polygon"}
            positions={polygonPoints}
            pathOptions={{ color: "gray", snapIgnore: false }}
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

          {parcelCreated && (
            <Polygon
              ref={parentPolygonRef}
              key={"new field parcel"}
              positions={parcelPolygonPoints}
              pathOptions={{ color: polygonColor }}
            />
          )}

          {parcelCreated && referenceRow && rows.length === 0 && (
            <Polyline
              positions={referenceRow}
              pathOptions={{ color: "blue" }}
              // @ts-ignore
              id={referenceLineId}
            />
          )}

          {fieldParcels.map((parcel) => (
            <Polygon
              ref={parentPolygonRef}
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
        </MapContainer>
      </Box>
    </>
  );
}

export default AddParcelView;
