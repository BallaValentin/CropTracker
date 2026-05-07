import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import type { GetCropFieldData } from "../interfaces/response/GetCropFieldData";
import CustomLayers from "../leaflet/CustomLayers";
import CheckIcon from "@mui/icons-material/Check";
import { defaultMapPosition } from "../utils/Constants";
import { getCropFieldById } from "../services/CropFieldService";

function PlotDetailsPage() {
  const { data: user, isLoading: isUserLoading, error } = useUserProfile();
  const [cropFieldDetail, setCropFieldDetail] = useState<GetCropFieldData>({
    uid: "",
    name: "Unnamed Field",
    markerPosition: {
      lat: 51.505,
      lng: -0.09,
    },
    polygonPoints: [],
    area: 0,
  });
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  let authenticated = true;

  const { data: plotData, isLoading: isPlotLoading } = useQuery({
    queryKey: ["plots", id],
    queryFn: () => getCropFieldById(id || ""),
    staleTime: 0,
    enabled: !!id,
    refetchInterval: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const { success, message } = location.state || {};
    if (success && message) {
      setFeedbackMessage(message);
      const timer = setTimeout(() => setFeedbackMessage(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  if (error) {
    authenticated = false;
  }

  useEffect(() => {
    if (plotData) {
      setCropFieldDetail(plotData);
    }
  }, [plotData]);

  if (isUserLoading || isPlotLoading) {
    return <ProgressCircle loadingMessage="Loading your data..." />;
  }

  const handleUpdateClick = () => {
    navigate("/update-cropfield/" + id);
  };

  return (
    <>
      <Box>
        <MainHeader userData={user} authenticated={authenticated} />
        <MainContainer hasDrawer={authenticated}>
          {feedbackMessage && (
            <Alert
              icon={<CheckIcon fontSize="inherit" />}
              severity="success"
              sx={{ mt: 10 }}
            >
              {feedbackMessage}
            </Alert>
          )}
          <Typography
            variant="h4"
            component={"h1"}
            sx={{
              mt: feedbackMessage ? 0 : 16,
              mb: 2,
              color: "success.main",
              fontWeight: "bold",
              letterSpacing: "0.02em",
              lineHeight: 1.6,
            }}
          >
            {cropFieldDetail.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 4, fontStyle: "italic" }}
          >
            Here you can view the details of your field. The map below shows the
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
              center={
                cropFieldDetail.markerPosition
                  ? [
                      cropFieldDetail.markerPosition.lat,
                      cropFieldDetail.markerPosition.lng,
                    ]
                  : [defaultMapPosition.lat, defaultMapPosition.lng]
              }
              zoom={16}
            >
              <ChangeView
                center={
                  cropFieldDetail.markerPosition
                    ? [
                        cropFieldDetail.markerPosition.lat,
                        cropFieldDetail.markerPosition.lng,
                      ]
                    : [defaultMapPosition.lat, defaultMapPosition.lng]
                }
                zoom={16}
              />

              <LayersControl position="topright">
                <CustomLayers />
              </LayersControl>

              <FeatureGroup>
                {cropFieldDetail?.polygonPoints &&
                  cropFieldDetail.polygonPoints.length > 0 && (
                    <Polygon
                      key={cropFieldDetail.uid}
                      positions={cropFieldDetail.polygonPoints}
                      pathOptions={{ color: "blue" }}
                    />
                  )}
                {cropFieldDetail.markerPosition && (
                  <Marker
                    position={[
                      cropFieldDetail.markerPosition.lat,
                      cropFieldDetail.markerPosition.lng,
                    ]}
                  />
                )}
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
