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
}

function MapDetailZoomControl({
  rows,
  rowRectangles,
  cropCoords,
}: ZoomControlProps) {
  const map = useMap();

  const lowZoomGroupRef = useRef(L.layerGroup());
  const mediumZoomGroupRef = useRef(L.layerGroup());
  const highZoomGroupRef = useRef(L.layerGroup());
  const indexRef = useRef<Flatbush | null>(null);
  const cropsRef = useRef<LatLngObject[]>([]);

  useEffect(() => {
    const layerGroup = lowZoomGroupRef.current;
    layerGroup.clearLayers();

    for (const rowLine of rows) {
      L.polyline(rowLine, { color: "black" }).addTo(layerGroup);
    }
  }, [rows]);

  useEffect(() => {
    const layerGroup = mediumZoomGroupRef.current;
    layerGroup.clearLayers();

    for (const rectangle of rowRectangles) {
      L.polygon(rectangle, {
        color: "black",
        fillColor: "black",
        fillOpacity: 0.8,
      }).addTo(layerGroup);
    }
  }, [rowRectangles]);

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
    mediumSelectZoomRef: null,
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
