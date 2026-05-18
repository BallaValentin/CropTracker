import { type DrawEvents } from "leaflet";
import L from "leaflet";
import { useMap } from "react-leaflet";
import type { LatLngObject } from "../interfaces/LatLngObject";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import * as turf from "@turf/turf";

interface DrawingToolsProps {
  onPolygonCreated: (polygon: LatLngObject[]) => void;
  onPolygonDeleted: () => void;
  fieldParcels: GetFieldParcelDTO[];
}

export const useDrawHandler = ({
  onPolygonCreated,
  onPolygonDeleted,
  fieldParcels,
}: DrawingToolsProps) => {
  const map = useMap();

  const _onCreated = (e: DrawEvents.Created) => {
    const { layer, layerType } = e;
    const currentZoom = map.getZoom();
    const currentCenter = map.getCenter();
    let formattedPoints = [] as LatLngObject[];

    map.fire("draw:drawstop");

    if (layerType === "polygon") {
      const polygonLayer = layer as L.Polygon;
      let userGeoJSon = polygonLayer.toGeoJSON();

      let completelyInsideExistingParcel = false;

      for (const parcel of fieldParcels) {
        const parcelGeoJSON = turf.polygon([
          parcel.polygonPoints.map((point) => [point.lng, point.lat]),
        ]);

        const difference = turf.difference(
          turf.featureCollection([userGeoJSon, parcelGeoJSON]),
        );

        if (!difference) {
          completelyInsideExistingParcel = true;
          break;
        }

        userGeoJSon = difference;
      }

      if (completelyInsideExistingParcel) {
        alert(
          "The drawn parcel is completely inside an existing parcel. Please draw a parcel that does not overlap with existing parcels.",
        );
        layer.remove();
      } else {
        const coordinates = userGeoJSon.geometry.coordinates;
        const outerRing = coordinates[0] as [number, number][];
        const geometryType = userGeoJSon.geometry.type;

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

  const _onDeleted = (e: DrawEvents.Deleted) => {
    const { layers } = e;
    const currentZoom = map.getZoom();
    const currentCenter = map.getCenter();

    layers.eachLayer((layer) => {
      if (layer instanceof L.Polygon) {
        onPolygonDeleted();
      }
    });

    setTimeout(() => {
      map.setView(currentCenter, currentZoom, { animate: false });
    }, 10);
  };

  return { _onCreated, _onDeleted };
};
