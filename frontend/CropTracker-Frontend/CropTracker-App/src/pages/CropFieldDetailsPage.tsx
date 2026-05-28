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
import { useMutation, useQuery } from "@tanstack/react-query";
import type { GetCropFieldDTO } from "../interfaces/response/GetCropFieldDTO";
import CheckIcon from "@mui/icons-material/Check";
import { getCropFieldById } from "../services/CropFieldService";
import { defaultMapPosition } from "../utils/Constants";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import CropFieldInfoPanel from "../elements/panels/CropFieldInfoPanel";
import CreateFieldParcelForm from "../elements/forms/CreateFieldParcelForm";
import type { CreateFieldParcelDTO } from "../interfaces/request/CreateFieldParcelDTO";
import {
  createFieldParcel,
  deleteFieldParcel,
  updateFieldParcel,
} from "../services/FieldParcelService";
import { useFieldParcels } from "../hooks/UseFieldParcels";
import { queryClient } from "../query-client/QueryClient";
import UpdateFieldParcelForm from "../elements/forms/UpdateFieldParcelForm";
import type { UpdateFieldParcelDTO } from "../interfaces/request/UpdateFieldParcelDTO";

function PlotDetailsPage() {
  const { data: user, isLoading: isUserLoading } = useUserProfile();
  const [cropFieldDetail, setCropFieldDetail] = useState<GetCropFieldDTO>({
    uid: "",
    name: "Unnamed Field",
    markerPosition: defaultMapPosition,
    polygonPoints: [],
    area: 0,
  });
  const [fieldParcelsData, setFieldParcelsData] = useState<GetFieldParcelDTO[]>(
    [],
  );
  const [addParcel, setAddParcel] = useState<boolean>(false);
  const [updateParcel, setUpdateParcel] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [selectedFieldParcel, setSelectedFieldParcel] =
    useState<GetFieldParcelDTO | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: fieldParcels, isLoading: isFieldParcelsLoading } =
    useFieldParcels(id || "");

  useEffect(() => {
    if (fieldParcels) {
      setFieldParcelsData(fieldParcels);
    }
  }, [fieldParcels]);

  const { data: plotData, isLoading: isCropFieldLoading } = useQuery({
    queryKey: ["cropfields", id],
    queryFn: () => getCropFieldById(id || ""),
    staleTime: 0,
    enabled: !!id,
    refetchInterval: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createFieldParcel,
    onSuccess: () => {
      setFeedbackMessage("Field parcel created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["fieldParcels", id],
      });
      setAddParcel(false);
    },
  });

  const { mutate: updateMutate, isPending: isUpdatePending } = useMutation({
    mutationFn: ({
      fieldParcelId,
      updateFieldParcelData,
    }: {
      fieldParcelId: string;
      updateFieldParcelData: UpdateFieldParcelDTO;
    }) => updateFieldParcel(updateFieldParcelData, fieldParcelId),
    onSuccess: () => {
      setFeedbackMessage("Field parcel updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["fieldParcels", id],
      });
      setUpdateParcel(false);
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteFieldParcel,
    onSuccess: () => {
      setFeedbackMessage("Field parcel deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["fieldParcels", id],
      });
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

  const handleUpdateParcelClick = (fieldParcel: GetFieldParcelDTO) => {
    setUpdateParcel(true);
    setSelectedFieldParcel(fieldParcel);
  };

  const createNewFieldParcel = (
    createFieldParcelData: CreateFieldParcelDTO,
  ) => {
    console.log("Create field parcel data: ", createFieldParcelData);
    mutate(createFieldParcelData);
  };

  const updateExistingFieldParcel = (
    updateFieldParcelData: UpdateFieldParcelDTO,
    fieldParcelId: string,
  ) => {
    console.log("Updating field parcel");
    updateMutate({ fieldParcelId, updateFieldParcelData });
  };

  const deleteSelectedParcel = (fieldParcelId: string) => {
    deleteMutate(fieldParcelId);
  };

  const handleAddFieldWorkClick = () => {
    navigate(`/add-field-work/${id}`);
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

          {addParcel && (
            <CreateFieldParcelForm
              isPending={isPending}
              onSubmit={createNewFieldParcel}
              fieldParcels={fieldParcelsData || []}
              cropfield={cropFieldDetail}
            />
          )}

          {updateParcel && selectedFieldParcel && (
            <UpdateFieldParcelForm
              isPending={isUpdatePending}
              onSubmit={updateExistingFieldParcel}
              fieldParcels={
                fieldParcelsData.filter(
                  (parcel) => parcel.uid != selectedFieldParcel.uid,
                ) || []
              }
              cropfield={cropFieldDetail}
              fieldParcelToUpdate={selectedFieldParcel}
            />
          )}

          {!addParcel && !updateParcel && (
            <CropFieldInfoPanel
              cropFieldDetail={cropFieldDetail}
              isLoading={isFieldParcelsLoading}
              fieldParcels={fieldParcelsData || []}
              onAddParcelClick={handleAddParcelClick}
              onConfirmDelete={deleteSelectedParcel}
              onUpdateParcelClick={handleUpdateParcelClick}
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
          <Box sx={{ display: "flex", mr: 3, justifyContent: "flex-end" }}>
            <Button color="success" onClick={handleAddFieldWorkClick}>
              Add Field Work
            </Button>
          </Box>
        </MainContainer>
      </Box>
    </>
  );
}

export default PlotDetailsPage;
