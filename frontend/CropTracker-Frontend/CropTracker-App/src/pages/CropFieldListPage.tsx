import { Alert, Box, Divider, Fab, Typography } from "@mui/material";
import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useUserProfile } from "../hooks/UseUserProfile";
import ColumnCenterContainer from "../elements/containers/ColumnCenterContainer";
import { useEffect, useState } from "react";
import type { GetCropFieldDTO } from "../interfaces/response/GetCropFieldDTO";
import { useMutation } from "@tanstack/react-query";
import { getCropFields } from "../services/CropFieldService";
import AddIcon from "@mui/icons-material/Add";
import { useLocation, useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import { useUserCropFields } from "../hooks/UseUserCropFields";
import CropFieldCard from "../elements/cards/CropFieldCard";

function PlotsListPage() {
  const { data: user, isLoading, error } = useUserProfile();
  const { data: userCropField } = useUserCropFields();
  const [cropFields, setCropFields] = useState<GetCropFieldDTO[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [fabHovered, setFabHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  let authenticated = true;

  const { mutate } = useMutation({
    mutationFn: getCropFields,
    onSuccess: (response: GetCropFieldDTO[]) => {
      setCropFields(response);
    },
  });

  useEffect(() => {
    const { success, message } = location.state || {};
    if (success && message) {
      setFeedbackMessage(message);
      const timer = setTimeout(() => setFeedbackMessage(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  useEffect(() => {
    mutate();
  }, [user, mutate, userCropField]);

  if (isLoading) {
    return <ProgressCircle loadingMessage="Loading fields..." />;
  }

  if (error) {
    authenticated = false;
  }

  return (
    <>
      <Box>
        <MainHeader userData={user} authenticated={authenticated} />
        <MainContainer hasDrawer={authenticated}>
          {feedbackMessage && (
            <Alert
              icon={<CheckIcon fontSize="inherit" />}
              sx={{
                mt: 10,
                mr: 1,
              }}
              severity="success"
            >
              {feedbackMessage}
            </Alert>
          )}

          {cropFields.length === 0 ? (
            <Box sx={{ mt: feedbackMessage ? 0 : 16 }}>
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
                sx={{ mt: feedbackMessage ? 0 : 16, fontWeight: "bold" }}
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
                Add Plot
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
