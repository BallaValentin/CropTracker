import { Box, GlobalStyles, Typography } from "@mui/material";
import MainHeader from "../elements/headers/MainHeader";
import { useUserProfile } from "../hooks/UseUserProfile";
import ProgressCircle from "../elements/progress/ProgressCircle";
import MainContainer from "../elements/containers/MainContainer";
import ColumnCenterContainer from "../elements/containers/ColumnCenterContainer";

function MainPage() {
  const { data: user, isLoading } = useUserProfile();

  if (isLoading) {
    return <ProgressCircle loadingMessage="Loading your profile" />;
  }

  return (
    <>
      <GlobalStyles styles={{ body: { margin: 0 } }} />
      <Box sx={{ bgcolor: "#d0edc5ff" }}>
        <MainHeader userData={user} />
        <MainContainer hasDrawer={Boolean(user?.username)}>
          <ColumnCenterContainer>
            <Typography variant="h2" component={"h1"}>
              Welcome to Crop Tracker!
            </Typography>
          </ColumnCenterContainer>
        </MainContainer>
      </Box>
    </>
  );
}

export default MainPage;
