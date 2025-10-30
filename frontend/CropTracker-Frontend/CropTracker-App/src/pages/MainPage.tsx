import { Box } from "@mui/material";
import MainHeader from "../elements/headers/MainHeader";
import { useUserProfile } from "../hooks/UseUserProfile";
import ProgressCircle from "../elements/progress/ProgressCircle";

function MainPage() {
  const { data: user, isLoading } = useUserProfile();

  if (isLoading) {
    return <ProgressCircle />;
  }

  return (
    <Box>
      <MainHeader userData={user} />
    </Box>
  );
}

export default MainPage;
