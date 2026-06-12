import { Box } from "@mui/material";
import { LayersControl, MapContainer, Polygon } from "react-leaflet";
import type { LatLngObject } from "../interfaces/LatLngObject";
import { defaultMapPosition } from "../utils/Constants";
import CustomLayers from "./CustomLayers";
import { useEffect, useRef, useState } from "react";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import L from "leaflet";
import {
  getGeneratedCrops,
  getGeneratedRectabgles,
  getGeneratedRows,
} from "../utils/GenerateShapesUtil";
import SelectMapRowsControl from "./SelectMapRowsControl";
import MapBoundsHelper from "./MapBoundsHelper";

interface AddParcelViewProps {
  polygonPoints: LatLngObject[];
  markerPosition: LatLngObject | null;
  uid: string;
  mapHeight: number;
  fieldParcels: GetFieldParcelDTO[];
  affectedRows: boolean[];
  previousRows?: boolean[];
  previousHidden?: boolean;
  onRowClick: (rowIndex: number) => void;
}

function AddParcelView({
  mapHeight,
  markerPosition,
  uid,
  polygonPoints,
  fieldParcels,
  affectedRows,
  previousRows = [],
  previousHidden = true,
  onRowClick,
}: AddParcelViewProps) {
  const parentPolygonRef = useRef<L.Polygon | null>(null);
  const [rows, setRows] = useState<LatLngObject[][][]>([]);
  const [rowRectangles, setRowRectangles] = useState<LatLngObject[][]>([]);
  const [crops, setCrops] = useState<LatLngObject[]>([]);

  useEffect(() => {
    setRows(
      fieldParcels.map((parcel) =>
        getGeneratedRows({
          polygonCoords: parcel.polygonPoints,
          referenceRow: parcel.layoutParameters.referenceRow,
          numberOfRows: parcel.layoutParameters.numberOfRows,
          rowDistance:
            parcel.layoutParameters.bedSpacing +
            parcel.layoutParameters.rowWidth,
        }),
      ),
    );
  }, [fieldParcels]);

  useEffect(() => {
    setRowRectangles(
      fieldParcels.flatMap((parcel, index) =>
        getGeneratedRectabgles({
          rows: rows[index] || [],
          rowWidth: parcel.layoutParameters.rowWidth,
        }),
      ),
    );
  }, [fieldParcels, rows]);

  useEffect(() => {
    setCrops(
      fieldParcels.flatMap((parcel, index) =>
        getGeneratedCrops({
          rows: rows[index] || [],
          rowWidth: parcel.layoutParameters.rowWidth,
          rowMargin: parcel.layoutParameters.marginSpacing,
          rowSpacing: parcel.layoutParameters.rowSpacing,
          cropSpacing: parcel.layoutParameters.plantSpacing,
        }),
      ),
    );
  }, [fieldParcels, rows]);

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
          {polygonPoints && polygonPoints.length > 3 && (
            <MapBoundsHelper polygonPoints={polygonPoints} />
          )}
          <LayersControl position="topright">
            <CustomLayers />
          </LayersControl>

          <SelectMapRowsControl
            rows={rows.flat()}
            rowRectangles={rowRectangles}
            cropCoords={crops}
            affectedRows={affectedRows}
            previousRows={previousRows}
            previousHidden={previousHidden}
            onRowClick={onRowClick}
          />

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
