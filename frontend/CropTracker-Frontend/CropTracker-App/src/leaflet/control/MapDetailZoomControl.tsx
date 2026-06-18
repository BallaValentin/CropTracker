import { useMap } from "react-leaflet";
import type { LatLngObject } from "../../interfaces/helper/LatLngObject";

import L from "leaflet";
import { useEffect, useRef } from "react";
import { useZoom } from "../../hooks/leaflet/UseMapZoom";
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
  affectedRows = [],
}: ZoomControlProps) {
  const map = useMap();

  const lowZoomGroupRef = useRef(L.layerGroup());
  const mediumZoomGroupRef = useRef(L.layerGroup());
  const mediumSelectZoomRef = useRef(L.layerGroup());
  const highZoomGroupRef = useRef(L.layerGroup());
  const indexRef = useRef<Flatbush | null>(null);
  const cropsRef = useRef<LatLngObject[]>([]);

  useEffect(() => {
    const layerGroup = lowZoomGroupRef.current;
    layerGroup.clearLayers();

    rows.forEach((row, index) => {
      let isAffected = false;
      if (index < affectedRows.length) {
        isAffected = affectedRows[index] || false;
      }
      L.polyline(row, {
        color: isAffected ? "blue" : "black",
        weight: isAffected ? 1.5 : 1,
      }).addTo(layerGroup);
    });
  }, [affectedRows, rows]);

  useEffect(() => {
    const layerGroup = mediumZoomGroupRef.current;
    const selectLayerGroup = mediumSelectZoomRef.current;
    layerGroup.clearLayers();
    selectLayerGroup.clearLayers();

    rowRectangles.forEach((rectangle, index) => {
      let isAffected = false;
      if (index < affectedRows.length) {
        isAffected = affectedRows[index] || false;
      }
      L.polygon(rectangle, {
        color: "black",
        fillColor: "black",
        fillOpacity: 0.8,
      }).addTo(layerGroup);

      if (isAffected) {
        L.polygon(rectangle, {
          color: "#00f0ff",
          fillColor: "#00b0ff",
          weight: 2.5,
          fillOpacity: 0.1,
        }).addTo(selectLayerGroup);
      }
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
    mediumSelectZoomRef: mediumSelectZoomRef,
    highZoomGroupRef: highZoomGroupRef,
    indexRef: indexRef,
    cropsRef: cropsRef,
  });

  useEffect(() => {
    if (!map) return;

    if (!map.getPane("cropPane")) {
      map.createPane("cropPane");
      map.getPane("cropPane")!.style.zIndex = "1000";

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
