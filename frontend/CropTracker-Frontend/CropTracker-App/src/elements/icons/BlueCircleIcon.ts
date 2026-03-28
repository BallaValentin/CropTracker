import L from "leaflet";

export const blueCircleIcon = L.divIcon({
    className: "custom-vertex-icon",
    html: '<div style="background-color: blue; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });