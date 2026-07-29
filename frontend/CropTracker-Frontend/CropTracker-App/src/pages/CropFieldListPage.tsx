import { Box, Divider, Fab, Typography } from "@mui/material";
import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import ProgressCircle from "../elements/progress/ProgressCircle";
import ColumnCenterContainer from "../elements/containers/ColumnCenterContainer";
import { useEffect, useRef, useState } from "react";
import type { GetCropFieldDTO } from "../interfaces/response/GetCropFieldDTO";
import { useLocation, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { useUserCropFields } from "../hooks/caching/UseUserCropFields";
import CropFieldCard from "../elements/cards/CropFieldCard";
import { useCurrentProfile } from "../hooks/caching/UseCurrentUser";
import { addSnackbar } from "../utils/SnackbarHelper";

function PlotsListPage() {
  const [cropFields, setCropFields] = useState<GetCropFieldDTO[]>([]);
  const [fabHovered, setFabHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const feedbackRef = useRef<string | null>(null);

  const { data: user, isLoading, error: userError } = useCurrentProfile();
  const { data: cropFieldsData, isLoading: isLoadingCropFields } =
    useUserCropFields(!!user);

  useEffect(() => {
    if (cropFieldsData) {
      setCropFields(cropFieldsData);
    }
  }, [cropFieldsData]);

  useEffect(() => {
    const { success, message } = location.state || {};
    if (
      success &&
      message &&
      (!feedbackRef.current || feedbackRef.current !== location.key)
    ) {
      feedbackRef.current = location.key;
      addSnackbar(message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  if (isLoading) {
    return <ProgressCircle loadingMessage="Initializing user data..." />;
  }

  if (userError) {
    if (userError.response?.status === 401) {
      navigate("/?error=unauthorized");
    }
  }

  if (isLoadingCropFields || !cropFieldsData) {
    return (
      <Box>
        <MainHeader />
        <MainContainer>
          <ProgressCircle loadingMessage="Loading crop fields..." />
        </MainContainer>
      </Box>
    );
  }

  return (
    <>
      <Box>
        <MainHeader />
        <MainContainer>
          {cropFields.length === 0 ? (
            <Box>
              <ColumnCenterContainer>
                <Typography variant="h4">
                  You haven't added any fields yet.
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Click the button below to create your first field and start
                  tracking your crops!
                </Typography>
              </ColumnCenterContainer>
            </Box>
          ) : (
            <>
              <Typography
                component={"h1"}
                color="success"
                letterSpacing={"0.02em"}
                sx={{ fontWeight: "bold" }}
                variant="h3"
              >
                My Fields
              </Typography>
              <Divider
                sx={{
                  height: 3,
                  backgroundColor: "success.secondary",
                }}
              />
              <Box sx={{ mb: 10 }}>
                {cropFields.map((cropField) => {
                  return (
                    <CropFieldCard key={cropField.uid} cropField={cropField} />
                  );
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
                bgcolor: "success.light",
                color: "success.contrastText",
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
                Add Crop Field
              </Typography>
            </Box>
            <Fab
              color="success"
              sx={{ "&:hover": { bgcolor: "success.dark" } }}
              aria-label="add"
              onClick={() => navigate("/create-cropfield")}
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
