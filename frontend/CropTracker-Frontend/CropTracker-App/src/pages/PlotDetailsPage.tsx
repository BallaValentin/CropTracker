import { Box, Typography } from "@mui/material";
import { useUserProfile } from "../hooks/UseUserProfile";
import MainHeader from "../elements/headers/MainHeader";
import MainContainer from "../elements/containers/MainContainer";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useQuery } from "@tanstack/react-query";
import { getPlotById } from "../services/PlotService";
import type { Plot } from "../interfaces/Plot";
import ChangeView from "../leaflet/ChangeView";

function PlotDetailsPage() {
  const { data: user, isLoading: isUserLoading, error } = useUserProfile();
  const [plotDetail, setPlotDetail] = useState<Plot>({
    uid: "",
    name: "Unnamed Plot",
    latitude: 0.0,
    longitude: 0.0,
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
              <Marker
                position={{
                  lat: plotDetail.latitude,
                  lng: plotDetail.longitude,
                }}
                ref={(marker) => {
                  marker?.openPopup();
                }}
              >
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
