import { Alert, Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useUserProfile } from "../hooks/UseUserProfile";
import MainHeader from "../elements/headers/MainHeader";
import MainContainer from "../elements/containers/MainContainer";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { useQuery } from "@tanstack/react-query";
import type { GetCropFieldDTO } from "../interfaces/response/GetCropFieldDTO";
import CheckIcon from "@mui/icons-material/Check";
import { getCropFieldById } from "../services/CropFieldService";
import { defaultMapPosition } from "../utils/Constants";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import CropFieldInfoPanel from "../elements/panels/CropFieldInfoPanel";
import CreateFieldParcelForm from "../elements/forms/CreateFieldParcelForm";
import type { CreateFieldParcelDTO } from "../interfaces/response/CreateFieldParcelDTO";

function PlotDetailsPage() {
  const { data: user, isLoading: isUserLoading } = useUserProfile();
  const [cropFieldDetail, setCropFieldDetail] = useState<GetCropFieldDTO>({
    uid: "",
    name: "Unnamed Field",
    markerPosition: defaultMapPosition,
    polygonPoints: [],
    fieldParcels: [] as GetFieldParcelDTO[],
    area: 0,
  });
  const [addParcel, setAddParcel] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: plotData, isLoading: isCropFieldLoading } = useQuery({
    queryKey: ["cropfields", id],
    queryFn: () => getCropFieldById(id || ""),
    staleTime: 0,
    enabled: !!id,
    refetchInterval: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
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
    if (plotData) {
      setCropFieldDetail(plotData);
    }
  }, [plotData]);

  if (isUserLoading || isCropFieldLoading) {
    return <ProgressCircle loadingMessage="Loading your data..." />;
  }

  const handleUpdateClick = () => {
    navigate("/update-cropfield/" + id);
  };

  const handleAddParcelClick = () => {
    setAddParcel(true);
  };

  const createNewFieldParcel = (
    createFieldParcelData: CreateFieldParcelDTO,
  ) => {
    console.log("Create field parcel data: ", createFieldParcelData);
  };

  return (
    <>
      <Box>
        <MainHeader userData={user} />
        <MainContainer hasDrawer={Boolean(user?.username)}>
          {feedbackMessage && (
            <Alert
              icon={<CheckIcon fontSize="inherit" />}
              severity="success"
              sx={{ mt: 10 }}
            >
              {feedbackMessage}
            </Alert>
          )}
          <Typography
            variant="h4"
            component={"h1"}
            sx={{
              mt: feedbackMessage ? 0 : 16,
              mb: 2,
              color: "success.main",
              fontWeight: "bold",
              letterSpacing: "0.02em",
              lineHeight: 1.6,
            }}
          >
            {cropFieldDetail.name}
          </Typography>

          {addParcel ? (
            <CreateFieldParcelForm
              onSubmit={createNewFieldParcel}
              cropfield={cropFieldDetail}
            />
          ) : (
            <CropFieldInfoPanel
              cropFieldDetail={cropFieldDetail}
              onAddParcelClick={handleAddParcelClick}
            />
          )}

          <Typography
            variant="body2"
            sx={{ mt: 4, color: "text.secondary", fontStyle: "italic" }}
          >
            You can edit the details of your field or update its boundaries by
            clicking the button below. This will take you to the edit page where
            you can make changes to your field's information and shape.
          </Typography>
          <Button
            sx={{ mt: 3 }}
            variant="contained"
            color="success"
            onClick={handleUpdateClick}
          >
            Edit Field
          </Button>
        </MainContainer>
      </Box>
    </>
  );
}

export default PlotDetailsPage;
