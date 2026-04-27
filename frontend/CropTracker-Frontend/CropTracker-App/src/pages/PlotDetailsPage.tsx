import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useUserProfile } from "../hooks/UseUserProfile";
import MainHeader from "../elements/headers/MainHeader";
import MainContainer from "../elements/containers/MainContainer";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useEffect, useState } from "react";
import {
  MapContainer,
  FeatureGroup,
  Polygon,
  TileLayer,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ChangeView from "../leaflet/ChangeView";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { useQuery } from "@tanstack/react-query";
import { getPlotById } from "../services/PlotService";
import type { Plot } from "../interfaces/Plot";
import { blueCircleIcon } from "../elements/icons/BlueCircleIcon";

function PlotDetailsPage() {
  const { data: user, isLoading: isUserLoading, error } = useUserProfile();
  const [plotDetail, setPlotDetail] = useState<Plot>({
    uid: "",
    name: "Unnamed Field",
    latitude: 51.505,
    longitude: -0.09,
    polygonPoints: [],
  });
  const { id } = useParams();
  const plotId: string = id || "0";
  let authenticated = true;

  const { data: plotData, isLoading: isPlotLoading } = useQuery({
    queryKey: [`plot-${plotId}`],
    queryFn: () => getPlotById(plotId),
    staleTime: 1000 * 60 * 60,
    refetchInterval: 1000 * 60 * 60,
  });

  if (error) {
    authenticated = false;
  }

  useEffect(() => {
    if (plotData) {
      setPlotDetail(plotData);
    }
  }, [plotData]);

  if (isUserLoading || isPlotLoading) {
    return <ProgressCircle loadingMessage="Loading your data..." />;
  }

  return (
    <>
      <Box>
        <MainHeader userData={user} authenticated={authenticated} />
        <MainContainer hasDrawer={authenticated}>
          <Typography variant="h2" sx={{ textAlign: "center" }}>
            {plotDetail.name}
          </Typography>

          <Box sx={{ mt: 2, height: 600, width: "100%" }}>
            <MapContainer
              style={{ height: "100%" }}
              center={[plotDetail.latitude, plotDetail.longitude]}
              zoom={16}
            >
              <ChangeView
                center={[plotDetail.latitude, plotDetail.longitude]}
                zoom={16}
              />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FeatureGroup>
                <EditControl
                  position="topright"
                  draw={{
                    marker: true,
                    polyline: false,
                    circle: false,
                    rectangle: false,
                    circlemarker: false,
                    polygon: {
                      allowIntersection: false,
                      drawError: {
                        color: "#e1e100",
                        message:
                          "<strong>Error:<strong> shape edges cannot intersect!",
                      },
                      icon: blueCircleIcon,
                      shapeOptions: {
                        color: "#3388FF",
                      },
                    },
                  }}
                />
                {plotDetail?.polygonPoints &&
                  plotDetail.polygonPoints.length > 0 && (
                    <Polygon
                      key={JSON.stringify(plotDetail.polygonPoints)}
                      positions={plotDetail.polygonPoints}
                      pathOptions={{ color: "blue" }}
                    />
                  )}
                <Marker
                  position={[plotDetail.latitude, plotDetail.longitude]}
                />
              </FeatureGroup>
            </MapContainer>
          </Box>
        </MainContainer>
      </Box>
    </>
  );
}

export default PlotDetailsPage;
