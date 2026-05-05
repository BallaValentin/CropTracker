import { Box } from "@mui/material";
import ProgressCircle from "../elements/progress/ProgressCircle";
import MainHeader from "../elements/headers/MainHeader";
import MainContainer from "../elements/containers/MainContainer";
import { useUserProfile } from "../hooks/UseUserProfile";
import CreatePlotForm from "../elements/forms/CreatePlotForm";
import { useMutation } from "@tanstack/react-query";
import { createPlot } from "../services/PlotService";
import { useNavigate } from "react-router-dom";
import type { PostPlot } from "../interfaces/request/PostPlot";

function CreatePlotPage() {
  const { data: user, isLoading, error } = useUserProfile();
  const navigate = useNavigate();
  let authenticated = true;

  if (error) {
    authenticated = false;
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createPlot,
    onSuccess: () => {
      navigate("/show-plots", {
        state: {
          success: true,
          message: "New plot has been successfully added",
        },
      });
    },
  });

  if (isLoading) {
    return <ProgressCircle loadingMessage="Loading your data..." />;
  }

  const sendCreatePlot = (postPlot: PostPlot) => {
    mutate(postPlot);
  };

  return (
    <>
      <Box>
        <MainHeader userData={user} authenticated={authenticated} />
        <MainContainer hasDrawer={authenticated}>
          <CreatePlotForm
            isPending={isPending}
            onSubmit={(postPlotData) => {
              sendCreatePlot(postPlotData);
            }}
          />
        </MainContainer>
      </Box>
    </>
  );
}

export default CreatePlotPage;
