import { useMap } from "react-leaflet";
import { breakPointMedium } from "../utils/Constants";

interface ZoomProps {
    lowZoomGroup: L.LayerGroup;
    mediumZoomGroup: L.LayerGroup
};

export const useZoom = ({lowZoomGroup, mediumZoomGroup}: ZoomProps) => {
    const map = useMap();

    const _onZoom = () => {
        const currentZoom = map.getZoom();

        if (currentZoom < breakPointMedium) {
        if(!map.hasLayer(lowZoomGroup)) {
            map.addLayer(lowZoomGroup);
        }
        map.removeLayer(mediumZoomGroup);
    } 
    
    else if (currentZoom >= breakPointMedium) {
        map.removeLayer(lowZoomGroup);
        if (!map.hasLayer(mediumZoomGroup)) {
            map.addLayer(mediumZoomGroup);
        }
    }
    }

    return {_onZoom};
}