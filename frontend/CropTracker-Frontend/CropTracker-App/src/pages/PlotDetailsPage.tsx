import { Box, Typography } from "@mui/material";
import { useUserProfile } from "../hooks/UseUserProfile";
import MainHeader from "../elements/headers/MainHeader";
import MainContainer from "../elements/containers/MainContainer";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useEffect, useState } from "react";
import type { UpdatePlot } from "../interfaces/request/UpdatePlot";
import { useLocation } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

function PlotDetailsPage() {
  const { data: user, isLoading, error } = useUserProfile();
  const [plotDetail, setPlotDetail] = useState<UpdatePlot>({
    name: "Unnamed Plot",
    latitude: 51.505,
    longitude: -0.09,
  });
  const { id } = useParams();
  let authenticated = true;

  if (error) {
    authenticated = false;
  }

  if (isLoading) {
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
              center={{
                lat: plotDetail.latitude,
                lng: plotDetail.longitude,
              }}
              zoom={13}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[plotDetail.latitude, plotDetail.longitude]}>
                <Popup>Your plot is here</Popup>
              </Marker>
            </MapContainer>
          </Box>
        </MainContainer>
      </Box>
    </>
  );
}

export default PlotDetailsPage;
