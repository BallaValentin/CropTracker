import { useEffect, useRef } from "react";
import { useDrawHandler } from "../hooks/UseDrawHandler";
import Flatbush from "flatbush";
import type { LatLngObject } from "../interfaces/LatLngObject";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useZoom } from "../hooks/UseMapZoom";

interface DrawingToolsProps {
  onPolygonCreated: (polygon: LatLngObject[]) => void;
  onPolygonUpdated: (polygon: LatLngObject[]) => void;
  onPolygonDeleted: () => void;
  onReferenceRowAdded: (row: LatLngObject[]) => void;
  polygonColor: string;
  fieldParcels: GetFieldParcelDTO[];
  parentPolygon: LatLngObject[];
  selectedParcel: LatLngObject[];
  rows: LatLngObject[][];
  rowRectangles: LatLngObject[][];
  crops: LatLngObject[];
  allowCreate: boolean;
  allowDelete: boolean;
}

function FieldParcelDrawControl({
  onPolygonCreated,
  onPolygonDeleted,
  onPolygonUpdated,
  onReferenceRowAdded,
  polygonColor,
  fieldParcels,
  parentPolygon,
  rows,
  rowRectangles,
  crops,
  allowCreate,
  allowDelete,
  selectedParcel,
}: DrawingToolsProps) {
  const map = useMap();

  const { _onCreated, _onDeleted, _onUpdated, _onDrawStart } = useDrawHandler({
    onPolygonCreated,
    onPolygonDeleted,
    onPolygonUpdated,
    onReferenceRowAdded,
    fieldParcels: fieldParcels,
    parentPolygon: parentPolygon,
    selectedParcel,
  });

  const lowZoomGroupRef = useRef(L.layerGroup());

  useEffect(() => {
    const layerGroup = lowZoomGroupRef.current;
    layerGroup.clearLayers();

    rows.forEach((row) => {
      L.polyline(row, {
        color: "black",
      }).addTo(layerGroup);
    });
  }, [rows]);

  const midZoomGroupRef = useRef(L.layerGroup());

  useEffect(() => {
    const layerGroup = midZoomGroupRef.current;
    layerGroup.clearLayers();

    rowRectangles.map(
      (rectangle) => {
        L.polygon(rectangle, {
          color: "black",
          fillColor: "black",
          fillOpacity: 0.8,
        }).addTo(layerGroup);
      },
      [rowRectangles],
    );
  });

  const highZoomGroupRef = useRef(L.layerGroup());
  const spacialIndexRef = useRef<Flatbush | null>(null);
  const cropsRef = useRef<LatLngObject[]>([]);

  useEffect(() => {
    const layerGroup = highZoomGroupRef.current;
    layerGroup.clearLayers();

    if (crops.length === 0) return;

    const index = new Flatbush(crops.length);

    crops.forEach((crop) => {
      index.add(crop.lng, crop.lat, crop.lng, crop.lat);
    });

    index.finish();
    console.log("Index length: ", index);

    cropsRef.current = crops;
    spacialIndexRef.current = index;
  });

  const { _onZoom, _onMapViewChange } = useZoom({
    lowZoomGroupRef: lowZoomGroupRef,
    mediumZoomGroupRef: midZoomGroupRef,
    highZoomGroupRef: highZoomGroupRef,
    indexRef: spacialIndexRef,
    cropsRef: cropsRef,
  });

  useEffect(() => {
    if (!map) return;
    map.on("moveend", _onMapViewChange);
    map.on("resize", _onMapViewChange);
    map.on("pm:drawstart", _onDrawStart);
    map.on("pm:create", _onCreated);
    map.on("zoomend", _onZoom);
    map.on("pm:globaleditmodetoggled", (e) => {
      if (!e.enabled) {
        const layersGroup = map.pm.getGeomanLayers(true) as L.FeatureGroup;

        layersGroup.getLayers().forEach((layer) => {
          _onUpdated(layer);
        });
      }
    });
    map.on("pm:remove", _onDeleted);
    map.pm.addControls({
      position: "topright",

      drawMode: allowCreate,
      drawControls: allowCreate,
      editMode: true,
      removalMode: allowDelete,

      drawPolygon: allowCreate,
      drawText: false,
      drawRectangle: false,
      drawCircle: false,
      drawMarker: false,
      drawPolyline: true,
      drawCircleMarker: false,
    });
    map.pm.setPathOptions({
      color: polygonColor,
    });
    map.pm.setGlobalOptions({
      snappable: true,
      snapDistance: 20,
      allowSelfIntersection: false,
      requireContainment: [],
    });

    map.pm.enableDraw("Line", { snappable: false });
    map.pm.disableDraw("Line");

    map.pm.enableDraw("Polygon", { snappable: true });
    map.pm.disableDraw("Polygon");

    return () => {
      map.off("moveend", _onMapViewChange);
      map.off("resize", _onMapViewChange);
      map.off("zoomend", _onZoom);
      map.off("pm:create", _onCreated);
      map.off("pm:drawstart", _onDrawStart);
      map.off("pm:globaleditmodetoggled");
      map.off("pm:remove", _onDeleted);
      map.pm.removeControls();
    };
  }, [
    _onCreated,
    _onDeleted,
    _onUpdated,
    _onDrawStart,
    _onMapViewChange,
    allowCreate,
    allowDelete,
    map,
    polygonColor,
    fieldParcels,
    parentPolygon,
    selectedParcel,
    _onZoom,
  ]);

  return null;
}

export default FieldParcelDrawControl;
