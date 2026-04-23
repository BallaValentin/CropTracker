import { LayerGroup, LayersControl, TileLayer } from "react-leaflet";

function CustomLayers() {
  return (
    <>
      <LayersControl.BaseLayer checked name="OpenStreetMap">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>

      <LayersControl.BaseLayer name="SatelliteView">
        <LayerGroup>
          <TileLayer
            attribution="Tiles &copy; Esri..."
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxNativeZoom={18}
            maxZoom={20}
          />

          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            maxNativeZoom={18}
            maxZoom={20}
          />
        </LayerGroup>
      </LayersControl.BaseLayer>
    </>
  );
}

export default CustomLayers;
