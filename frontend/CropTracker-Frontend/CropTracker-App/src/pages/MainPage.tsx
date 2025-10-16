import { Box } from "@mui/material";
import MainHeader from "../elements/headers/MainHeader";
import { useUserProfile } from "../hooks/UseUserProfile";

function MainPage() {
  const { data: user, isLoading } = useUserProfile();

  if (isLoading) {
    return null;
  }

  return (
    <Box>
      <MainHeader userData={user} />
    </Box>
  );
}

export default MainPage;
