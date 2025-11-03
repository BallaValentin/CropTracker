import { Box, Typography } from "@mui/material";
import MainHeader from "../elements/headers/MainHeader";
import { useUserProfile } from "../hooks/UseUserProfile";
import ProgressCircle from "../elements/progress/ProgressCircle";
import MainContainer from "../elements/containers/MainContainer";
import ColumnCenterContainer from "../elements/containers/ColumnCenterContainer";

function MainPage() {
  const { data: user, isLoading, error } = useUserProfile();
  let authenticated: boolean = true;

  if (isLoading) {
    return <ProgressCircle />;
  }

  if (error) {
    authenticated = false;
  }

  return (
    <Box>
      <MainHeader userData={user} authenticated={authenticated} />
      <MainContainer hasDrawer={authenticated}>
        <ColumnCenterContainer>
          <Typography variant="h2">Welcome to Crop Tracker!</Typography>
        </ColumnCenterContainer>
      </MainContainer>
    </Box>
  );
}

export default MainPage;
