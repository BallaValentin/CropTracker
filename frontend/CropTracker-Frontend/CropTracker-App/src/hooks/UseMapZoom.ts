import { useMap } from "react-leaflet";
import { breakPointHigh, breakPointMedium, cropWidthCm } from "../utils/Constants";
import type { LatLngObject } from "../interfaces/LatLngObject";
import type Flatbush from "flatbush";
import L from "leaflet";

interface ZoomProps {
    lowZoomGroupRef: React.MutableRefObject<L.LayerGroup>;
    mediumZoomGroupRef: React.MutableRefObject<L.LayerGroup>;
    highZoomGroupRef: React.MutableRefObject<L.LayerGroup>;
    indexRef: React.MutableRefObject<Flatbush | null>;
    cropsRef: React.MutableRefObject<LatLngObject[]>;
};

export const useZoom = ({lowZoomGroupRef, mediumZoomGroupRef, highZoomGroupRef, indexRef, cropsRef}: ZoomProps) => {
    const map = useMap();

    const _onZoom = () => {
        const currentZoom = map.getZoom();
        const lowZoomGroup = lowZoomGroupRef.current;
        const mediumZoomGroup = mediumZoomGroupRef.current;
        const highZoomGroup = highZoomGroupRef.current;

        if (currentZoom < breakPointMedium) {
        if(!map.hasLayer(lowZoomGroup)) {
            map.addLayer(lowZoomGroup);
        }
        map.removeLayer(mediumZoomGroup);
        map.removeLayer(highZoomGroup);
    } 
    
    else if (currentZoom >= breakPointMedium && currentZoom <= breakPointHigh) {
        map.removeLayer(lowZoomGroup);
        map.removeLayer(highZoomGroup);
        if (!map.hasLayer(mediumZoomGroup)) {
            map.addLayer(mediumZoomGroup);
        }
    } else {
        map.removeLayer(lowZoomGroup);
        if (!map.hasLayer(highZoomGroup)) {
            map.addLayer(highZoomGroup);
        }
    }
    }

    const _onMapViewChange = () => {
        const index = indexRef.current;
        const highZoomGroup = highZoomGroupRef.current;
        const crops = cropsRef.current;

        if (!index || !crops || crops.length === 0) return;

        const currentZoom = map.getZoom();

        if (currentZoom >= breakPointHigh) {
            highZoomGroup.clearLayers();

            const screenBounds = map.getBounds();

            const visibleCropIndexes = index.search(
                screenBounds.getWest(),
                screenBounds.getSouth(),
                screenBounds.getEast(),
                screenBounds.getNorth()
            );

            for (let i = 0; i < visibleCropIndexes.length; i++) {
                const cropIndex = visibleCropIndexes[i];
                const crop = crops[cropIndex];

                L.circleMarker(crop, {
                    color: "green",
                    radius: cropWidthCm / 200
                }).addTo(highZoomGroup);
            }
        }
    }

    return {_onZoom, _onMapViewChange};
}