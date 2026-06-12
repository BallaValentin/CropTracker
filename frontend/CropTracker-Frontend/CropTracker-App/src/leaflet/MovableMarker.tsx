import { Marker, useMapEvents } from "react-leaflet";

interface MovableMarkerProps {
  latitude: number;
  longitude: number;
  onLocationClick: (latitude: number, longitude: number) => void;
}

function MovableMarker({
  latitude,
  longitude,
  onLocationClick,
}: MovableMarkerProps) {
  useMapEvents({
    click(event) {
      onLocationClick(event.latlng.lat, event.latlng.lng);
    },
  });

  return (
    <Marker position={{ lat: latitude, lng: longitude }}>
      Your plot is here
    </Marker>
  );
}

export default MovableMarker;
