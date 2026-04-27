import { Alert, Box, Divider, Fab, Tooltip, Typography } from "@mui/material";
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

function PlotsListPage() {
  const { data: user, isLoading, error } = useUserProfile();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  let authenticated = true;

  const { mutate } = useMutation({
    mutationFn: getPlots,
    mutationKey: ["plots"],
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
  }, [user, mutate]);

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
                You don`t have any plots added yet
              </Typography>
            </ColumnCenterContainer>
          ) : (
            <>
              <Typography sx={{ textAlign: "center", mt: 10 }} variant="h3">
                My Plots
              </Typography>
              <Divider />
              {plots.map((plot) => {
                return <PlotCard key={plot.uid} plot={plot} />;
              })}
            </>
          )}
          <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1300 }}>
            <Tooltip title="Add new plot" placement="left-start">
              <Fab
                color="success"
                aria-label="add"
                onClick={() => navigate("/create-plot")}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          </Box>
        </MainContainer>
      </Box>
    </>
  );
}

export default PlotsListPage;
