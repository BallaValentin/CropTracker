import L from "leaflet";
import type { LatLngObject } from "../interfaces/LatLngObject";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import * as turf from "@turf/turf";
import { useMap } from "react-leaflet";

interface DrawingToolsProps {
  onPolygonCreated: (polygon: LatLngObject[]) => void;
  onPolygonUpdated: (polygon: LatLngObject[]) => void;
  onPolygonDeleted: () => void;
  fieldParcels: GetFieldParcelDTO[];
  parentPolygon: LatLngObject[];
}

export const useDrawHandler = ({
  onPolygonCreated,
  onPolygonUpdated,
  onPolygonDeleted,
  fieldParcels,
  parentPolygon,
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
    removeLayer(layer, currentCenter, currentZoom);
  };

  const _onUpdated = (layer: L.Layer) => {
    console.log("ON UPDATE EVENT START");

    if (layer instanceof L.Polygon) {
      console.log("RECEIVED POLYGON");
      let polygonLayer = layer as L.Polygon;
      const croppedPolygonLayer = cropPolygonInside(polygonLayer);
      console.log("CROPPED POLYGON");

      if (croppedPolygonLayer) {
        polygonLayer = croppedPolygonLayer;
        const overlapCroppedPolygonResult = cropOverlappinParts(polygonLayer);
        if (overlapCroppedPolygonResult) {
          polygonLayer = overlapCroppedPolygonResult.polygonLayer;
          console.log("CROPPED COMMON PARTS");
          polygonLayer.redraw();
          onPolygonUpdated(overlapCroppedPolygonResult.formattedPoints);
        }
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

  return { _onCreated, _onUpdated, _onDeleted };
};
