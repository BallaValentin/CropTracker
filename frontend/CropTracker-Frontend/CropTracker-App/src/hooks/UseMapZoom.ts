import { useMap } from "react-leaflet";
import { breakPointHigh, breakPointMedium } from "../utils/Constants";

interface ZoomProps {
    lowZoomGroup: L.LayerGroup;
    mediumZoomGroup: L.LayerGroup;
    highZoomGroup: L.LayerGroup
};

export const useZoom = ({lowZoomGroup, mediumZoomGroup, highZoomGroup}: ZoomProps) => {
    const map = useMap();

    const _onZoom = () => {
        const currentZoom = map.getZoom();

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

    return {_onZoom};
}