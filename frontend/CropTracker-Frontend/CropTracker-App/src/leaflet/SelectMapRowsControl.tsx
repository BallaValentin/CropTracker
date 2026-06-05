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
  previousRows?: boolean[];
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
  previousRows = [],
  onRowClick,
}: ZoomControlProps) {
  const map = useMap();

  const lowZoomGroupRef = useRef(L.layerGroup());
  const mediumZoomGroupRef = useRef(L.layerGroup());
  const mediumZoomSelectRef = useRef(L.featureGroup());
  const highZoomGroupRef = useRef(L.layerGroup());
  const indexRef = useRef<Flatbush | null>(null);
  const cropsRef = useRef<LatLngObject[]>([]);
  const linesRef = useRef<SelectPolyline[]>([]);
  const rectanglesRef = useRef<SelectPolygon[]>([]);
  const selectRectanglesRef = useRef<SelectPolygon[]>([]);

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
  }, [rows, previousRows]);

  useEffect(() => {
    const layerGroup = mediumZoomGroupRef.current;
    const selectLayerGroup = mediumZoomSelectRef.current;

    selectLayerGroup.clearLayers();
    layerGroup.clearLayers();

    rowRectangles.forEach((rectangle, index) => {
      const polygon = L.polygon(rectangle, {
        color: "black",
        weight: 1,
        fillColor: "black",
        fillOpacity: 0.75,
        rowIndex: index,
      } as SelectShapeOptions).addTo(layerGroup);

      const selectPolygon = L.polygon(rectangle, {
        color: "#2196f3",
        weight: 1.5,
        fillColor: "#00b0ff",
        fillOpacity: 0,
        rowIndex: index,
      } as SelectShapeOptions).addTo(selectLayerGroup);

      rectanglesRef.current.push(polygon as SelectPolygon);
      selectRectanglesRef.current.push(selectPolygon as SelectPolygon);
    });

    selectLayerGroup.off("click");

    selectLayerGroup.on("click", (event: L.LeafletMouseEvent) => {
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
      selectLayerGroup.off("click");
    };
  }, [rowRectangles, affectedRows, onRowClick]);

  useEffect(() => {
    const selectPolygons = selectRectanglesRef.current;
    const lines = linesRef.current;

    lines.forEach((line) => {
      const index = line.options.rowIndex;
      let previousSelected = false;
      if (index < previousRows.length) {
        previousSelected = previousRows[index];
      }
      const isAffected = affectedRows[index];

      let lineColor = "black";

      if (isAffected && previousSelected) {
        lineColor = "purple";
      } else if (isAffected) {
        lineColor = "blue";
      } else if (previousSelected) {
        lineColor = "red";
      }

      line.setStyle({
        color: lineColor,
        weight: isAffected ? 1.5 : 1,
      });
    });

    selectPolygons.forEach((polygon) => {
      const index = polygon.options.rowIndex;
      const isAffected = affectedRows[index];
      let previousSelected = false;
      if (index < previousRows.length) {
        previousSelected = previousRows[index];
      }

      let outlineColor = "#00f0ff";
      let fillColor = "#00b0ff";

      if (isAffected && previousSelected) {
        outlineColor = "#ab47bc";
        fillColor = "#e1bee7";
      } else if (previousSelected) {
        outlineColor = "#ef5350";
        fillColor = "#ffcdd2";
      }
      polygon.setStyle({
        color: outlineColor,
        weight: isAffected || previousSelected ? 2.5 : 0,
        fillColor: fillColor,
        fillOpacity: isAffected || previousSelected ? 0.1 : 0,
      });
    });
  }, [affectedRows, previousRows]);

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
    mediumSelectZoomRef: mediumZoomSelectRef,
    highZoomGroupRef: highZoomGroupRef,
    indexRef: indexRef,
    cropsRef: cropsRef,
  });

  useEffect(() => {
    if (!map) return;

    if (!map.getPane("cropPane")) {
      map.createPane("cropPane");
      map.getPane("cropPane")!.style.zIndex = "400";

      L.svg({ pane: "cropPane" }).addTo(map);
    }

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
