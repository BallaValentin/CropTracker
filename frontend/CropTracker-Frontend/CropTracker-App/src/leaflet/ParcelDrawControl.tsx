import { useEffect, useRef } from "react";
import { useParcelDraw } from "../hooks/leaflet/UseParcelDraw";
import Flatbush from "flatbush";
import type { LatLngObject } from "../interfaces/helper/LatLngObject";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useZoom } from "../hooks/leaflet/UseMapZoom";
import { useMapDistance } from "../hooks/leaflet/UseMapDistance";

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
  referenceRow: LatLngObject[];
  lineRef: React.RefObject<L.Polyline | null>;
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
  referenceRow,
  rows,
  rowRectangles,
  crops,
  allowCreate,
  allowDelete,
  selectedParcel,
  lineRef,
}: DrawingToolsProps) {
  const map = useMap();
  const tooltipRef = useRef<L.Tooltip | null>(null);

  const { _onCreated, _onDeleted, _onUpdated } = useParcelDraw({
    onPolygonCreated,
    onPolygonDeleted,
    onPolygonUpdated,
    onReferenceRowAdded,
    fieldParcels: fieldParcels,
    parentPolygon: parentPolygon,
    referenceRow: referenceRow,
    lineRef,
    selectedParcel,
  });

  const { _onDrawStart, _onDrawEnd } = useMapDistance();

  const lowZoomGroupRef = useRef(L.layerGroup());

  useEffect(() => {
    const layerGroup = lowZoomGroupRef.current;
    layerGroup.clearLayers();

    rows.forEach((row) => {
      L.polyline(row, {
        color: "black",
        weight: 1,
        pmIgnore: true,
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
          pmIgnore: true,
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

    if (crops.length === 0) {
      cropsRef.current = crops;
      spacialIndexRef.current = null;
      return;
    }

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
    mediumSelectZoomRef: null,
    highZoomGroupRef: highZoomGroupRef,
    indexRef: spacialIndexRef,
    cropsRef: cropsRef,
  });

  map.pm.setLang(
    "custom-en" as Parameters<typeof map.pm.setLang>[0],
    {
      buttonTitles: {
        drawPolyButton: "Draw parcel outline",
        editButton: "Edit parcel and reference line",
        deleteButton: "Delete parcel outline",
        drawLineButton: "Draw reference line",
      },
    },
    "en",
  );

  useEffect(() => {
    if (!map || !map.pm) return;

    if (!tooltipRef.current) {
      tooltipRef.current = L.tooltip({
        permanent: true,
        direction: "right",
        className: "distance-tooltip",
      });
    }

    if (!map.getPane("cropPane")) {
      map.createPane("cropPane");
      map.getPane("cropPane")!.style.zIndex = "400";

      L.svg({ pane: "cropPane" }).addTo(map);
    }

    map.on("moveend", _onMapViewChange);
    map.on("resize", _onMapViewChange);
    map.on("pm:drawstart", _onDrawStart);
    map.on("pm:drawend", _onDrawEnd);
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
      rotateMode: false,
      dragMode: false,
      removalMode: allowDelete,

      drawPolygon: allowCreate,
      cutPolygon: false,
      drawText: false,
      drawRectangle: false,
      drawCircle: false,
      drawMarker: false,
      drawPolyline: selectedParcel.length > 0,
      drawCircleMarker: false,
    });
    map.pm.setPathOptions({
      color: polygonColor,
    });
    map.pm.setGlobalOptions({
      tooltips: false,
      snappable: true,
      snapDistance: 20,
      allowSelfIntersection: false,
      requireContainment: [],
    });

    return () => {
      map.off("moveend", _onMapViewChange);
      map.off("resize", _onMapViewChange);
      map.off("zoomend", _onZoom);
      map.off("pm:create", _onCreated);
      map.off("pm:drawend", _onDrawEnd);
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
    _onDrawEnd,
  ]);

  return null;
}

export default FieldParcelDrawControl;
