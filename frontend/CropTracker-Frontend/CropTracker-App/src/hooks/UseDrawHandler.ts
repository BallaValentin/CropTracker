import L from "leaflet";
import type { LatLngObject } from "../interfaces/LatLngObject";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import * as turf from "@turf/turf";
import { useMap } from "react-leaflet";
import '@geoman-io/leaflet-geoman-free';
import { referenceLineId, safetyThresholdMeters } from "../utils/Constants";

interface DrawingToolsProps {
  onPolygonCreated: (polygon: LatLngObject[]) => void;
  onPolygonUpdated: (polygon: LatLngObject[]) => void;
  onPolygonDeleted: () => void;
  onReferenceRowAdded: (row: LatLngObject[]) => void;
  onReferenceRowUpdated: (row: LatLngObject[]) => void;
  fieldParcels: GetFieldParcelDTO[];
  parentPolygon: LatLngObject[];
  selectedParcel: LatLngObject[];
  referenceRow: LatLngObject[];
}

interface CustomPolylineOptions extends L.PolylineOptions {
  id?: string | number;
}

export const useDrawHandler = ({
  onPolygonCreated,
  onPolygonUpdated,
  onPolygonDeleted,
  onReferenceRowAdded,
  onReferenceRowUpdated,
  fieldParcels,
  parentPolygon,
  selectedParcel,
  referenceRow
}: DrawingToolsProps) => {
  const map = useMap();

  const removeLayer = (layer: L.Layer, center: L.LatLng, zoom: number) => {
    setTimeout(() => {
      layer.remove();
      map.setView(center, zoom, { animate: false });
    }, 10);
  };

  const cropPolygonInside = (polygonLayer: L.Polygon) => {
    const parent = turf.polygon([
      parentPolygon.map((point) => [point.lng, point.lat]),
    ]);

    const newParcelGeoJSON = polygonLayer.toGeoJSON(18);
    const collection = turf.featureCollection([newParcelGeoJSON, parent]);
    const clippedIntersection = turf.intersect(collection);

    if (!clippedIntersection) {
      alert("The drawn polygon is outside of the parent polygon component");
      polygonLayer.remove();
      return null;
    }

    const newPolygonLayer = L.GeoJSON.geometryToLayer(
      clippedIntersection,
    ) as L.Polygon;

    polygonLayer.setLatLngs(newPolygonLayer.getLatLngs());
    polygonLayer.redraw();

    return polygonLayer;
  };

  const cropOverlappinParts = (polygonLayer: L.Polygon) => {
    let newParcelGeoJSON = polygonLayer.toGeoJSON(18);

    for (const parcel of fieldParcels) {
      const parcelGeoJSON = turf.polygon([
        parcel.polygonPoints.map((point) => [point.lng, point.lat]),
      ]);

      const featureCollection = turf.featureCollection([
        newParcelGeoJSON,
        parcelGeoJSON,
      ]);

      const difference = turf.difference(featureCollection);

      if (!difference) {
        alert(
          "The drawn parcel is completely inside an existing parcel. Please draw a parcel that does not overlap with existing parcels.",
        );
        polygonLayer.remove();
        return null;
      }

      if (difference.geometry.type === "MultiPolygon") {
        for (const geometryCoordinates of difference.geometry.coordinates) {
          const turfGeometry = turf.polygon(geometryCoordinates);

          const featureCollection = turf.featureCollection([
            newParcelGeoJSON,
            turfGeometry,
          ]);
          if (turf.intersect(featureCollection)) {
            newParcelGeoJSON = turfGeometry;
            break;
          }
        }
      } else {
        newParcelGeoJSON = difference;
      }
    }

    const coordinates = newParcelGeoJSON.geometry.coordinates;
    const outerRing = coordinates[0] as [number, number][];
    const geometryType = newParcelGeoJSON.geometry.type;

    if (geometryType === "Polygon") {
      const formattedPoints = outerRing.map(([lng, lat]) => ({
        lat: lat,
        lng: lng,
      }));
      polygonLayer.setLatLngs(
        formattedPoints.map((point) => [point.lat, point.lng]),
      );
      return { polygonLayer, formattedPoints };
    } else {
      return null;
    }
  };

  const clipLineToParcel = (lineLatLngs: LatLngObject[]) => {
    if (!selectedParcel) return null;

    const line = turf.lineString(lineLatLngs.map(point => [point.lng, point.lat]));

    const polygonCoords = selectedParcel.map(point => [point.lng, point.lat]);
    const polygon = turf.polygon([polygonCoords]);
    const polygonBoundary = turf.lineString(polygonCoords);

    const inside = turf.booleanWithin(line, polygon);

    if (inside) {
      const formattedPoints = line.geometry.coordinates.map((point) => ({
        lat: point[1],
        lng: point[0]
      }));
      return formattedPoints;
    }

    const point1 = turf.point(line.geometry.coordinates[0]);
    const point2 = turf.point(line.geometry.coordinates[1]);
    const bearing = turf.bearing(point1, point2);

    const intersections = turf.lineIntersect(line, polygonBoundary);
    
    const pushedPoints = intersections.features.map(intersection => {
      let pushedPoint = turf.destination(intersection, safetyThresholdMeters, bearing, {
      units: "meters"
      });

      if (!turf.booleanPointInPolygon(pushedPoint, polygon)) {
        pushedPoint = turf.destination(intersection, -safetyThresholdMeters, bearing, {
          units: "meters"
        });
      }

      const [lng, lat] = pushedPoint.geometry.coordinates;
      return new L.LatLng(lat, lng);
    });

    if (pushedPoints.length === 2) {
      const formattedPoints = pushedPoints.map(p => ({ lat: p.lat, lng: p.lng }));
      return formattedPoints;
    }

      const formattedPoints = lineLatLngs.map((point) => {
      const turfPoint = turf.point([point.lng, point.lat]);

      const inside = turf.booleanPointInPolygon(turfPoint, polygon);
      if (inside) return point;

      return pushedPoints[0];
    });

    return formattedPoints;
  }

  const _onDrawStart = (e: {workingLayer: L.Layer, shape: string}) => {
    const {shape, workingLayer} = e;

    if (shape !== 'Line') return;

    const polylineLayer = workingLayer as L.Polyline;
    polylineLayer.options.snapIgnore = true;

    polylineLayer.on('pm:vertexadded', () => {
      
      if (polylineLayer.getLatLngs().length === 2) {
        const drawContext = map.pm.Draw;
        const finishFn = Reflect.get(drawContext.Line, '_finishShape') as (() => void) | undefined;

        if (typeof finishFn === 'function') {
          finishFn.call(drawContext.Line);
        }
      }
    });
  }

  const _onCreated = (e: { layer: L.Layer; shape: string }) => {
    map.pm.disableDraw();

    const { layer, shape } = e;
    const currentZoom = map.getZoom();
    const currentCenter = map.getCenter();

    map.fire("draw:drawstop");

    if (shape === "Polygon") {
      let polygonLayer = layer as L.Polygon;
      const croppedPolygonLayer = cropPolygonInside(polygonLayer);

      if (croppedPolygonLayer) {
        polygonLayer = croppedPolygonLayer;
        const overlapCroppedPolygonResult = cropOverlappinParts(polygonLayer);
        if (overlapCroppedPolygonResult) {
          polygonLayer = overlapCroppedPolygonResult.polygonLayer;
          polygonLayer.remove();
          polygonLayer.addTo(map);
          polygonLayer.redraw();
          onPolygonCreated(overlapCroppedPolygonResult.formattedPoints);
        }
      }
    }

    else if (shape === "Line") {
      const polylineLayer = layer as L.Polyline;
      const lineLatLngs = polylineLayer.getLatLngs();

      const clipLineResult = clipLineToParcel(lineLatLngs as LatLngObject[]);

      if (clipLineResult) {
        polylineLayer.setLatLngs(clipLineResult);
        onReferenceRowAdded(clipLineResult);
      }
    }

    removeLayer(layer, currentCenter, currentZoom);
  };

  const _onUpdated = (layer: L.Layer) => {

    if (layer instanceof L.Polygon) {
      let polygonLayer = layer as L.Polygon;
      const croppedPolygonLayer = cropPolygonInside(polygonLayer);

      if (croppedPolygonLayer) {
        polygonLayer = croppedPolygonLayer;
        const overlapCroppedPolygonResult = cropOverlappinParts(polygonLayer);
        if (overlapCroppedPolygonResult) {
          polygonLayer = overlapCroppedPolygonResult.polygonLayer;
          polygonLayer.redraw();
          onPolygonUpdated(overlapCroppedPolygonResult.formattedPoints);
          const clipLineResult = clipLineToParcel(referenceRow) as LatLngObject[];
          onReferenceRowUpdated(clipLineResult);

          map.eachLayer(mapLayer => {
            if (mapLayer instanceof L.Polyline && !(mapLayer instanceof L.Polygon)) {
              if ((mapLayer.options as CustomPolylineOptions).id === referenceLineId) {
                mapLayer.setLatLngs(clipLineResult);
                mapLayer.remove();
                mapLayer.addTo(map);
                mapLayer.redraw();
              }
            }
          });
        }
      }
    } else if (layer instanceof L.Polyline) {
      const polylineLayer = layer as L.Polyline;
      const lineLatLngs = polylineLayer.getLatLngs();

      const clipLineResult = clipLineToParcel(lineLatLngs as LatLngObject[]);

      if (clipLineResult) {
        polylineLayer.setLatLngs(clipLineResult);
        onReferenceRowAdded(clipLineResult);
      }
    }
  };

  const _onDeleted = (e: { layer: L.Layer; shape: string }) => {
    const { shape } = e;
    const currentZoom = map.getZoom();
    const currentCenter = map.getCenter();

    if (shape === "Polygon") {
      onPolygonDeleted();
    }

    setTimeout(() => {
      map.setView(currentCenter, currentZoom, { animate: false });
    }, 10);
  };

  return { _onCreated, _onUpdated, _onDeleted, _onDrawStart };
};
