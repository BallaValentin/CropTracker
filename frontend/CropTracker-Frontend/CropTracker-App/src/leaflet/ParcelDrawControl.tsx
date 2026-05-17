import { FeatureGroup } from "react-leaflet";
import { circleIcon } from "../elements/icons/CircleIcon";
import { EditControl } from "react-leaflet-draw";
import { useDrawHandler } from "../hooks/UseDrawHandler";
import type { LatLngObject } from "../interfaces/LatLngObject";

interface DrawingToolsProps {
  onPolygonCreated: (polygon: LatLngObject[]) => void;
  onPolygonDeleted: () => void;
  polygonColor: string;
}

function FieldParcelDrawControl({
  onPolygonCreated,
  onPolygonDeleted,
  polygonColor,
}: DrawingToolsProps) {
  const { _onCreated, _onDeleted } = useDrawHandler({
    onPolygonCreated,
    onPolygonDeleted,
  });

  return (
    <FeatureGroup>
      <EditControl
        position="topright"
        onCreated={_onCreated}
        onDeleted={_onDeleted}
        draw={{
          marker: false,
          polyline: false,
          circle: false,
          rectangle: false,
          circlemarker: false,
          polygon: {
            allowIntersection: false,
            showLength: true,
            metric: true,
            drawError: {
              color: "#e1e100",
              message: "<strong>Error:<strong> shape edges cannot intersect!",
            },
            icon: circleIcon({ color: polygonColor }),
            shapeOptions: {
              clickable: true,
              color: polygonColor,
            },
          },
        }}
      />
    </FeatureGroup>
  );
}

export default FieldParcelDrawControl;
