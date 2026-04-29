import { Box, Card, Typography } from "@mui/material";
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
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { useQuery } from "@tanstack/react-query";
import { getPlotById } from "../services/PlotService";
import type { Plot } from "../interfaces/Plot";

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
          <Typography
            variant="h4"
            component={"h1"}
            sx={{
              mb: 2,
              color: "success.main",
              fontWeight: "bold",
              letterSpacing: "0.02em",
              lineHeight: 1.6,
            }}
          >
            {plotDetail.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 4, fontStyle: "italic" }}
          >
            Here you can view the details of your plot. The map below shows the
            location and boundaries of your field.
          </Typography>

          <Card
            elevation={0}
            sx={{
              mt: 2,
              height: 600,
              width: "100%",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.0.05)",
            }}
          >
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
          </Card>
        </MainContainer>
      </Box>
    </>
  );
}

export default PlotDetailsPage;
