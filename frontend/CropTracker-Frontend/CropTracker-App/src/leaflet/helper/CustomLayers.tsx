import { useTranslation } from "react-i18next";
import { LayerGroup, LayersControl, TileLayer } from "react-leaflet";

function CustomLayers() {
  const { t } = useTranslation();

  return (
    <>
      <LayersControl.BaseLayer
        checked
        name={t("leaflet.customLayers.streetView", {
          defaultValue: "Street View",
        })}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxNativeZoom={18}
          maxZoom={25}
        />
      </LayersControl.BaseLayer>

      <LayersControl.BaseLayer
        name={t("leaflet.customLayers.satelliteView", {
          defaultValue: "Satellite View",
        })}
      >
        <LayerGroup>
          <TileLayer
            attribution="Tiles &copy; Esri..."
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxNativeZoom={18}
            maxZoom={25}
          />

          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            maxNativeZoom={18}
            maxZoom={25}
          />
        </LayerGroup>
      </LayersControl.BaseLayer>
    </>
  );
}

export default CustomLayers;
