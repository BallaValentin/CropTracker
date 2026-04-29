import { Alert, Box, Divider, Fab, Typography } from "@mui/material";
import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useUserProfile } from "../hooks/UseUserProfile";
import ColumnCenterContainer from "../elements/containers/ColumnCenterContainer";
import { useEffect, useState } from "react";
import type { Plot } from "../interfaces/Plot";
import { useMutation } from "@tanstack/react-query";
import { getPlots } from "../services/PlotService";
import AddIcon from "@mui/icons-material/Add";
import { useLocation, useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import PlotCard from "../elements/cards/PlotCard";
import { useUserPlots } from "../hooks/UseUserPlots";

function PlotsListPage() {
  const { data: user, isLoading, error } = useUserProfile();
  const { data: userPlots } = useUserPlots();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [fabHovered, setFabHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  let authenticated = true;

  const { mutate } = useMutation({
    mutationFn: getPlots,
    onSuccess: (response: Plot[]) => {
      setPlots(response);
    },
  });

  useEffect(() => {
    const { createPlotSuccess } = location.state || {};
    if (createPlotSuccess) {
      setFeedbackMessage("New plot has been successfully added");
      const timer = setTimeout(() => setFeedbackMessage(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  useEffect(() => {
    mutate();
  }, [user, mutate, userPlots]);

  if (isLoading) {
    return <ProgressCircle loadingMessage="Loading fields..." />;
  }

  if (error) {
    authenticated = false;
  }

  return (
    <>
      <Box>
        {feedbackMessage && (
          <Alert
            icon={<CheckIcon fontSize="inherit" />}
            sx={{
              position: "absolute",
              top: 8,
              left: "1.25%",
              width: "95%",
              zIndex: 1200,
            }}
            severity="success"
          >
            {feedbackMessage}
          </Alert>
        )}
        <MainHeader userData={user} authenticated={authenticated} />
        <MainContainer hasDrawer={authenticated}>
          {plots.length === 0 ? (
            <ColumnCenterContainer>
              <Typography variant="h4">
                You haven't added any fields yet.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                Click the button below to create your first plot and start
                tracking your crops!
              </Typography>
            </ColumnCenterContainer>
          ) : (
            <>
              <Typography
                component={"h1"}
                color="success"
                letterSpacing={"0.02em"}
                sx={{ mt: 10, fontWeight: "bold" }}
                variant="h3"
              >
                My Fields
              </Typography>
              <Divider />
              <Box sx={{ mb: 10 }}>
                {plots.map((plot) => {
                  return <PlotCard key={plot.uid} plot={plot} />;
                })}
              </Box>
            </>
          )}
          <Box
            sx={{
              position: "fixed",
              display: "flex",
              bottom: 16,
              right: 16,
              zIndex: 1300,
            }}
            onMouseEnter={() => setFabHovered(true)}
            onMouseLeave={() => setFabHovered(false)}
          >
            <Box
              sx={{
                height: 56,
                display: "flex",
                alignItems: "center",
                bgcolor: "#c9e2cc",
                borderRadius: "28px 0 0 28px",
                pl: fabHovered ? 3 : 0,
                pr: "32px",
                maxWidth: fabHovered ? "200px" : 0,
                opacity: fabHovered ? 1 : 0,
                transition: "all 0.3s ease-in-out",
                overflow: "hidden",
                whiteSpace: "nowrap",
                mr: -3,
              }}
            >
              <Typography variant="button" sx={{ fontWeight: "bold" }}>
                Add Plot
              </Typography>
            </Box>
            <Fab
              color="success"
              aria-label="add"
              onClick={() => navigate("/create-plot")}
            >
              <AddIcon />
            </Fab>
          </Box>
        </MainContainer>
      </Box>
    </>
  );
}

export default PlotsListPage;
