import { Box, Button, Card, Typography } from "@mui/material";
import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useUserProfile } from "../hooks/UseUserProfile";
import ColumnCenterContainer from "../elements/containers/ColumnCenterContainer";
import { useEffect, useState } from "react";
import type { Plot } from "../interfaces/Plot";
import { useMutation } from "@tanstack/react-query";
import { getPlots } from "../services/PlotService";
import { green } from "@mui/material/colors";

function PlotsListPage() {
  const { data: user, isLoading, error } = useUserProfile();
  const [plots, setPlots] = useState<Plot[]>([]);
  let authenticated = true;

  const { mutate } = useMutation({
    mutationFn: getPlots,
    onSuccess: (response: Plot[]) => {
      setPlots(response);
    },
  });

  useEffect(() => {
    mutate();
  }, [user]);

  if (isLoading) {
    return <ProgressCircle loadingMessage="Loading users" />;
  }

  if (error) {
    authenticated = false;
  }

  return (
    <>
      <Box>
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
              <Typography sx={{ textAlign: "center", mb: 5 }} variant="h3">
                My Plots
              </Typography>
              {plots.map((plot) => {
                return (
                  <Card>
                    <Box sx={{ m: 1, textAlign: "center" }}>
                      <Typography variant="h5">{plot.name}</Typography>
                    </Box>
                    <Button
                      sx={{
                        ml: 1,
                        mb: 1,
                        color: "white",
                        bgcolor: "#7bbf8fff",
                      }}
                    >
                      Details
                    </Button>
                  </Card>
                );
              })}
            </>
          )}
        </MainContainer>
      </Box>
    </>
  );
}

export default PlotsListPage;
