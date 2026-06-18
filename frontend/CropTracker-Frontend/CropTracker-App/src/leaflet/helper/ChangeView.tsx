import { useMap } from "react-leaflet";

interface ChangeViewProps {
  center: [number, number];
}

function ChangeView({ center }: ChangeViewProps) {
  const map = useMap();
  const zoom = map.getZoom();
  if (!zoom) {
    map.setView(center, 16, { animate: false });
  } else {
    map.setView(center, zoom, { animate: false });
  }
  return null;
}

export default ChangeView;
