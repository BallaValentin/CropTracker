import L from "leaflet";
import type { LatLngObject } from "../interfaces/LatLngObject";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import * as turf from "@turf/turf";
import { useMap } from "react-leaflet";

interface DrawingToolsProps {
  onPolygonCreated: (polygon: LatLngObject[]) => void;
  onPolygonDeleted: () => void;
  fieldParcels: GetFieldParcelDTO[];
  parentPolygon: LatLngObject[];
}

export const useDrawHandler = ({
  onPolygonCreated,
  onPolygonDeleted,
  fieldParcels,
  parentPolygon,
}: DrawingToolsProps) => {
  const map = useMap();

  const _onCreated = (e: { layer: L.Layer; shape: string }) => {
    const { layer, shape } = e;
    const currentZoom = map.getZoom();
    const currentCenter = map.getCenter();
    let formattedPoints = [] as LatLngObject[];

    map.fire("draw:drawstop");

    if (shape === "Polygon") {
      const polygonLayer = layer as L.Polygon;
      let newParcelGeoJSON = polygonLayer.toGeoJSON(18);

      let completelyInsideExistingParcel = false;

      const parent = turf.polygon([
        parentPolygon.map((point) => [point.lng, point.lat]),
      ]);

      const collection = turf.featureCollection([newParcelGeoJSON, parent]);
      const clippedIntersection = turf.intersect(collection);

      if (!clippedIntersection) {
        alert("The drawn polygon is outside of the parent polygon component");
        polygonLayer.remove();
        return;
      }

      map.pm.disableDraw();

      const newPolygonLayer = L.GeoJSON.geometryToLayer(
        clippedIntersection,
      ) as L.Polygon;

      polygonLayer.setLatLngs(newPolygonLayer.getLatLngs());
      polygonLayer.redraw();
      newParcelGeoJSON = newPolygonLayer.toGeoJSON(18);

      for (const parcel of fieldParcels) {
        const parcelGeoJSON = turf.polygon([
          parcel.polygonPoints.map((point) => [point.lng, point.lat]),
        ]);
        console.log("Parcel GeoJSON: ", parcelGeoJSON);
        console.log("New GeoJSON: ", newParcelGeoJSON);

        const featureCollection = turf.featureCollection([
          newParcelGeoJSON,
          parcelGeoJSON,
        ]);

        const difference = turf.difference(featureCollection);

        if (!difference) {
          completelyInsideExistingParcel = true;
          break;
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

        console.log("User geo json after: ", newParcelGeoJSON);
      }

      if (completelyInsideExistingParcel) {
        alert(
          "The drawn parcel is completely inside an existing parcel. Please draw a parcel that does not overlap with existing parcels.",
        );
        polygonLayer.remove();
      } else {
        const coordinates = newParcelGeoJSON.geometry.coordinates;
        const outerRing = coordinates[0] as [number, number][];
        const geometryType = newParcelGeoJSON.geometry.type;

        if (geometryType === "Polygon") {
          formattedPoints = outerRing.map(([lng, lat]) => ({
            lat: lat,
            lng: lng,
          }));
          polygonLayer.setLatLngs(
            formattedPoints.map((point) => [point.lat, point.lng]),
          );
        } else if (geometryType === "MultiPolygon") {
          alert(
            "MultiPolygon shapes are not supported. Please draw a single polygon without holes.",
          );
        }
      }

      polygonLayer.remove();
      polygonLayer.addTo(map);
      polygonLayer.redraw();
      onPolygonCreated(formattedPoints);
    }

    setTimeout(() => {
      layer.remove();
      map.setView(currentCenter, currentZoom, { animate: false });
    }, 10);
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

  return { _onCreated, _onDeleted };
};
