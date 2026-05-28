import { useMap } from "react-leaflet";
import type { LatLngObject } from "../interfaces/LatLngObject";

import L from "leaflet";
import { useEffect, useRef } from "react";
import { useZoom } from "../hooks/UseMapZoom";
import Flatbush from "flatbush";

interface ZoomControlProps {
  rows: LatLngObject[][];
  rowRectangles: LatLngObject[][];
  cropCoords: LatLngObject[];
  affectedRows: boolean[];
  onRowClick: (rowIndex: number) => void;
}

type SelectShapeOptions = L.PolylineOptions & { rowIndex: number };
type SelectPolygon = L.Polygon & { options: SelectShapeOptions };
type SelectPolyline = L.Polyline & { options: SelectShapeOptions };

function MapDetailZoomControl({
  rows,
  rowRectangles,
  cropCoords,
  affectedRows,
  onRowClick,
}: ZoomControlProps) {
  const map = useMap();

  const lowZoomGroupRef = useRef(L.layerGroup());
  const mediumZoomGroupRef = useRef(L.featureGroup());
  const highZoomGroupRef = useRef(L.layerGroup());
  const indexRef = useRef<Flatbush | null>(null);
  const cropsRef = useRef<LatLngObject[]>([]);
  const linesRef = useRef<SelectPolyline[]>([]);
  const rectanglesRef = useRef<SelectPolygon[]>([]);

  useEffect(() => {
    const layerGroup = lowZoomGroupRef.current;
    layerGroup.clearLayers();
    rows.forEach((row, index) => {
      const line = L.polyline(row, {
        color: "black",
        weight: 1,
        rowIndex: index,
      } as SelectShapeOptions).addTo(layerGroup);

      linesRef.current.push(line as SelectPolyline);
    });
  }, [rows]);

  useEffect(() => {
    const layerGroup = mediumZoomGroupRef.current;
    layerGroup.clearLayers();

    rowRectangles.forEach((rectangle, index) => {
      const polygon = L.polygon(rectangle, {
        color: "black",
        weight: 1,
        fillColor: "black",
        fillOpacity: 0.75,
        rowIndex: index,
      } as SelectShapeOptions).addTo(layerGroup);

      rectanglesRef.current.push(polygon as SelectPolygon);
    });

    layerGroup.off("click");

    layerGroup.on("click", (event: L.LeafletMouseEvent) => {
      const clickedPolygon = event.layer as SelectPolygon;

      if (
        clickedPolygon.options &&
        typeof clickedPolygon.options.rowIndex === "number"
      ) {
        const rowIndex = clickedPolygon.options.rowIndex;
        onRowClick(rowIndex);
      }
    });

    return () => {
      layerGroup.off("click");
    };
  }, [rowRectangles, affectedRows, onRowClick]);

  useEffect(() => {
    const polygons = rectanglesRef.current;
    const lines = linesRef.current;

    lines.forEach((line) => {
      const index = line.options.rowIndex;
      const isAffected = affectedRows[index];
      line.setStyle({
        color: isAffected ? "blue" : "black",
        weight: isAffected ? 1.5 : 1,
      });
    });

    polygons.forEach((polygon) => {
      const index = polygon.options.rowIndex;
      const isAffected = affectedRows[index];
      polygon.setStyle({
        color: isAffected ? "#2196f3" : "black",
        weight: isAffected ? 1.5 : 1,
        fillColor: isAffected ? "#00b0ff" : "black",
        fillOpacity: isAffected ? 0.9 : 0.75,
      });
    });
  }, [affectedRows]);

  useEffect(() => {
    const layerGroup = highZoomGroupRef.current;
    layerGroup.clearLayers();

    if (cropCoords.length === 0) return;

    const index = new Flatbush(cropCoords.length);

    for (const crop of cropCoords) {
      index.add(crop.lng, crop.lat, crop.lng, crop.lat);
    }

    index.finish();

    cropsRef.current = cropCoords;
    indexRef.current = index;
  }, [cropCoords]);

  const { _onZoom, _onMapViewChange } = useZoom({
    lowZoomGroupRef: lowZoomGroupRef,
    mediumZoomGroupRef: mediumZoomGroupRef,
    highZoomGroupRef: highZoomGroupRef,
    indexRef: indexRef,
    cropsRef: cropsRef,
  });

  useEffect(() => {
    if (!map) return;

    map.on("zoomend", _onZoom);
    map.on("moveend", _onMapViewChange);

    return () => {
      map.off("zoomend", _onZoom);
      map.off("moveend", _onMapViewChange);
    };
  });

  return null;
}

export default MapDetailZoomControl;
