import L from "leaflet";

export const showMapWarning = (map: L.Map, latlng: L.LatLng, message: string) => {
  const warningTooltip = L.tooltip()
    .setLatLng(latlng)
    .setContent(`⚠️ ${message}`)
    .addTo(map);

  setTimeout(() => {
    warningTooltip.remove();
  }, 1000);
};