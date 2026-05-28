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
}

function MapDetailZoomControl({
  rows,
  rowRectangles,
  cropCoords,
  affectedRows,
}: ZoomControlProps) {
  const map = useMap();

  const lowZoomGroupRef = useRef(L.layerGroup());
  const mediumZoomGroupRef = useRef(L.layerGroup());
  const highZoomGroupRef = useRef(L.layerGroup());
  const indexRef = useRef<Flatbush | null>(null);
  const cropsRef = useRef<LatLngObject[]>([]);

  useEffect(() => {
    console.log("Rows updated");
    const layerGroup = lowZoomGroupRef.current;
    layerGroup.clearLayers();
    rows.forEach((row, index) => {
      const isAffected = affectedRows[index];

      L.polyline(row, {
        color: isAffected ? "blue" : "black",
        weight: isAffected ? 1.5 : 1,
      }).addTo(layerGroup);
    });
  }, [rows, affectedRows]);

  useEffect(() => {
    const layerGroup = mediumZoomGroupRef.current;
    layerGroup.clearLayers();

    rowRectangles.forEach((rectangle, index) => {
      const isAffected = affectedRows[index];

      L.polygon(rectangle, {
        color: isAffected ? "#2196f3" : "black",
        weight: isAffected ? 1.5 : 1,
        fillColor: affectedRows[index] ? "#00b0ff" : "black",
        fillOpacity: isAffected ? 0.9 : 0.75,
      }).addTo(layerGroup);
    });
  }, [rowRectangles, affectedRows]);

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
