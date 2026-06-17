import { Box } from "@mui/material";
import { LayersControl, MapContainer, Polygon, Polyline } from "react-leaflet";
import type { LatLngObject } from "../interfaces/helper/LatLngObject";
import { defaultMapPosition } from "../utils/Constants";
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
import type { LayoutParameters } from "../interfaces/helper/LayoutParameters";
import MapBoundsHelper from "./MapBoundsHelper";

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
  onReferenceRowAdded: (referenceRow: LatLngObject[]) => void;
  fieldParcels: GetFieldParcelDTO[];
  allowCreate: boolean;
  allowDelete: boolean;
  layoutParameters: LayoutParameters;
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
  onReferenceRowAdded,
  parcelPolygonPoints,
  fieldParcels,
  allowCreate,
  allowDelete,
  layoutParameters,
}: AddParcelViewProps) {
  const [parcelCreated, setParcelCreated] = useState<boolean>(
    parcelPolygonPoints.length != 0,
  );

  const [rows, setRows] = useState<LatLngObject[][]>([]);
  const [rowRectangles, setRowRectangles] = useState<LatLngObject[][]>([]);
  const [cropCoords, setCropCoords] = useState<LatLngObject[]>([]);

  useEffect(() => {
    const generatedRows = getGeneratedRows({
      polygonCoords: parcelPolygonPoints,
      referenceRow: layoutParameters.referenceRow,
      numberOfRows: layoutParameters.numberOfRows,
      rowDistance: layoutParameters.bedSpacing + layoutParameters.rowWidth,
    });
    setRows(generatedRows || []);
  }, [
    layoutParameters.bedSpacing,
    layoutParameters.numberOfRows,
    layoutParameters.referenceRow,
    layoutParameters.rowWidth,
    parcelPolygonPoints,
  ]);

  useEffect(() => {
    setRowRectangles(
      getGeneratedRectabgles({ rows, rowWidth: layoutParameters.rowWidth }) ||
        [],
    );
  }, [layoutParameters.rowWidth, rows]);

  useEffect(() => {
    setCropCoords(
      getGeneratedCrops({
        rows,
        rowWidth: layoutParameters.rowWidth,
        rowMargin: layoutParameters.marginSpacing,
        rowSpacing: layoutParameters.rowSpacing,
        cropSpacing: layoutParameters.plantSpacing,
      }) || [],
    );
  }, [
    layoutParameters.marginSpacing,
    layoutParameters.plantSpacing,
    layoutParameters.rowSpacing,
    layoutParameters.rowWidth,
    rows,
  ]);

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

  const parentPolygonRef = useRef<L.Polygon | null>(null);
  const lineRef = useRef<L.Polyline | null>(null);

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
            onReferenceRowAdded={onReferenceRowAdded}
            selectedParcel={parcelPolygonPoints}
            lineRef={lineRef}
            referenceRow={layoutParameters.referenceRow}
            rows={rows}
            rowRectangles={rowRectangles}
            crops={cropCoords}
          />

          {polygonPoints && polygonPoints.length > 3 && (
            <MapBoundsHelper polygonPoints={polygonPoints} />
          )}

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

          {parcelCreated && layoutParameters.referenceRow && (
            <Polyline
              ref={lineRef}
              positions={layoutParameters.referenceRow}
              pathOptions={{
                color: "blue",
                opacity:
                  parcelCreated &&
                  layoutParameters.referenceRow &&
                  rows.length === 0
                    ? 1
                    : 0,
              }}
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
