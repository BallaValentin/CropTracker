import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useUserProfile } from "../hooks/UseUserProfile";
import MainHeader from "../elements/headers/MainHeader";
import MainContainer from "../elements/containers/MainContainer";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useEffect, useState } from "react";
import {
  MapContainer,
  FeatureGroup,
  Polygon,
  Marker,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ChangeView from "../leaflet/ChangeView";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { useQuery } from "@tanstack/react-query";
import { getPlotById } from "../services/PlotService";
import type { Plot } from "../interfaces/Plot";
import CustomLayers from "../leaflet/CustomLayers";

function PlotDetailsPage() {
  const { data: user, isLoading: isUserLoading, error } = useUserProfile();
  const [plotDetail, setPlotDetail] = useState<Plot>({
    uid: "",
    name: "Unnamed Field",
    markerPosition: {
      lat: 51.505,
      lng: -0.09,
    },
    polygonPoints: [],
    area: 0,
  });
  const { id } = useParams();
  const navigate = useNavigate();
  let authenticated = true;

  const { data: plotData, isLoading: isPlotLoading } = useQuery({
    queryKey: ["plots", id],
    queryFn: () => getPlotById(id || ""),
    staleTime: 0,
    enabled: !!id,
    refetchInterval: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
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

  const handleUpdateClick = () => {
    navigate("/update-plot/" + id);
  };

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

          <Paper
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
              center={[
                plotDetail.markerPosition.lat,
                plotDetail.markerPosition.lng,
              ]}
              zoom={16}
            >
              <ChangeView
                center={[
                  plotDetail.markerPosition.lat,
                  plotDetail.markerPosition.lng,
                ]}
                zoom={16}
              />

              <LayersControl position="topright">
                <CustomLayers />
              </LayersControl>

              <FeatureGroup>
                {plotDetail?.polygonPoints &&
                  plotDetail.polygonPoints.length > 0 && (
                    <Polygon
                      key={plotDetail.uid}
                      positions={plotDetail.polygonPoints}
                      pathOptions={{ color: "blue" }}
                    />
                  )}
                <Marker
                  position={[
                    plotDetail.markerPosition.lat,
                    plotDetail.markerPosition.lng,
                  ]}
                />
              </FeatureGroup>
            </MapContainer>
          </Paper>
          <Typography
            variant="body2"
            sx={{ mt: 4, color: "text.secondary", fontStyle: "italic" }}
          >
            You can edit the details of your field or update its boundaries by
            clicking the button below. This will take you to the edit page where
            you can make changes to your field's information and shape.
          </Typography>
          <Button
            sx={{ mt: 3 }}
            variant="contained"
            color="success"
            onClick={handleUpdateClick}
          >
            Edit Field
          </Button>
        </MainContainer>
      </Box>
    </>
  );
}

export default PlotDetailsPage;
