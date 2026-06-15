import { Box, GlobalStyles, Typography } from "@mui/material";
import MainHeader from "../elements/headers/MainHeader";
import ProgressCircle from "../elements/progress/ProgressCircle";
import MainContainer from "../elements/containers/MainContainer";
import ColumnCenterContainer from "../elements/containers/ColumnCenterContainer";
import { useNavigate, useSearchParams } from "react-router-dom";
import InvalidAuthTokenDialog from "../elements/dialogs/InvalidAuthTokenDialog";
import { useEffect, useState } from "react";
import { useCurrentProfile } from "../hooks/UseCurrentUser";

function MainPage() {
  const { isLoading } = useCurrentProfile(
    !!sessionStorage.getItem("accessToken"),
  );
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setDialogOpen(searchParams.get("error") === "unauthorized");
  }, [searchParams]);

  const handleClose = () => {
    setDialogOpen(false);
    searchParams.delete("error");
    setSearchParams(searchParams, { replace: true });
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    searchParams.delete("error");
    setSearchParams(searchParams, { replace: true });
    navigate("/signin");
  };

  if (isLoading) {
    return <ProgressCircle loadingMessage="Loading your profile" />;
  }

  return (
    <>
      <GlobalStyles styles={{ body: { margin: 0 } }} />
      <Box sx={{ bgcolor: "#d0edc5ff" }}>
        <MainHeader />
        <MainContainer>
          <ColumnCenterContainer>
            <Typography variant="h2" component={"h1"}>
              Welcome to Crop Tracker!
            </Typography>
          </ColumnCenterContainer>
        </MainContainer>

        {dialogOpen && (
          <InvalidAuthTokenDialog
            onConfirm={handleConfirm}
            onConfirmCancel={handleClose}
            open={dialogOpen}
          />
        )}
      </Box>
    </>
  );
}

export default MainPage;
