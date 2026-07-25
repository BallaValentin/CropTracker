import { Alert, Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MainHeader from "../elements/headers/MainHeader";
import MainContainer from "../elements/containers/MainContainer";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { useMutation } from "@tanstack/react-query";
import type { GetCropFieldDTO } from "../interfaces/response/GetCropFieldDTO";
import CheckIcon from "@mui/icons-material/Check";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import CropFieldInfoPanel from "../elements/panels/CropFieldInfoPanel";
import { deleteFieldParcel } from "../services/FieldParcelService";
import { useFieldParcels } from "../hooks/caching/UseFieldParcels";
import { queryClient } from "../query-client/QueryClient";
import { useCropFieldWork } from "../hooks/caching/UseCropFieldWorks";
import CropFieldWorksPanel from "../elements/panels/CropFieldWorksPanel";
import { useCropField } from "../hooks/caching/UseCropField";
import { useCurrentProfile } from "../hooks/caching/UseCurrentUser";
import type { ConfirmUpdateDTO } from "../interfaces/response/ConfirmUpdateDTO";
import ConfirmCropFieldUpdateDialog from "../elements/dialogs/ConfirmCropFieldUpdateDialog";
import { deleteSelectedFieldWorks } from "../services/FieldWorkService";
import DeleteFieldWorkDialog from "../elements/dialogs/DeleteFieldWorkDialog";

function PlotDetailsPage() {
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentProfile();
  const [cropFieldDetail, setCropFieldDetail] =
    useState<GetCropFieldDTO | null>(null);
  const [fieldParcelsData, setFieldParcelsData] = useState<GetFieldParcelDTO[]>(
    [],
  );

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [parcelsSelected, setParcelsSelected] = useState<boolean[]>([]);

  const [activeFieldParcelId, setActiveFieldParcelId] = useState<string>("");
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState<boolean>(false);
  const [workToDelete, setWorkToDelete] = useState<string | null>(null);
  const [ongoingWorksNumber, setOngoingWorksNumber] = useState<number>(0);
  const [scheduledWorksNumber, setScheduledWorksNumber] = useState<number>(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: cropFieldData, isLoading: isCropFieldLoading } = useCropField(
    id || "",
    !!id,
  );

  const { data: fieldParcels, isLoading: isFieldParcelsLoading } =
    useFieldParcels(id || "", !!id);

  const { data: fieldWorksData, isLoading: isFieldWorksLoading } =
    useCropFieldWork(id || "", !!id && !!user);

  const toDateTimeLocal = (date: Date): string => {
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:00Z`;
  };

  useEffect(() => {
    if (fieldParcels) {
      setFieldParcelsData(fieldParcels);
    }
  }, [fieldParcels]);

  useEffect(() => {
    if (fieldParcels) {
      const newParcelsSelected = fieldParcels.map(
        (_, index) => parcelsSelected[index] ?? false,
      );

      setParcelsSelected([...newParcelsSelected]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldParcels]);

  const { onGoingWorks, scheduledWorks } = useMemo(() => {
    if (!fieldWorksData) return { onGoingWorks: [], scheduledWorks: [] };

    const currentDate = toDateTimeLocal(new Date());
    const onGoing = fieldWorksData.filter(
      (fieldWork) =>
        fieldWork.workTiming === "Scheduled" &&
        fieldWork.startDate <= currentDate,
    );
    const scheduled = fieldWorksData.filter(
      (fieldWork) =>
        fieldWork.workTiming === "Scheduled" &&
        fieldWork.startDate > currentDate,
    );

    return { onGoingWorks: onGoing, scheduledWorks: scheduled };
  }, [fieldWorksData]);

  const { mutate: deleteMutate, isPending: isDeletePending } = useMutation({
    mutationFn: ({
      fieldParcelId,
      confirmUpdate,
    }: {
      fieldParcelId: string;
      confirmUpdate: boolean;
    }) => deleteFieldParcel(fieldParcelId, confirmUpdate),
    onSuccess: (data: ConfirmUpdateDTO | null) => {
      if (data?.confirmationRequired) {
        setConfirmUpdateOpen(true);
        setOngoingWorksNumber(data.numberOfOngoing);
        setScheduledWorksNumber(data.numberOfScheduled);
      } else {
        setFeedbackMessage("Field parcel deleted successfully!");
        queryClient.invalidateQueries({
          queryKey: ["fieldParcels", id],
        });
        queryClient.invalidateQueries({
          queryKey: ["cropfields", id],
        });
        queryClient.invalidateQueries({
          queryKey: ["fieldWorks", id],
        });
        queryClient.invalidateQueries({
          queryKey: ["fieldWork"],
        });
      }
    },
  });

  const { mutate: deleteFieldWorkMutate, isPending: isDeleteFieldWorkPending } =
    useMutation({
      mutationFn: deleteSelectedFieldWorks,
      onSuccess: () => {
        setFeedbackMessage("Field work deleted successfully!");
        queryClient.invalidateQueries({
          queryKey: ["fieldWorks", id],
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
    if (cropFieldData) {
      setCropFieldDetail(cropFieldData);
    }
  }, [cropFieldData]);

  if (isUserLoading || isCropFieldLoading || isFieldWorksLoading) {
    return <ProgressCircle loadingMessage="Initializing data..." />;
  }

  const handleUpdateClick = () => {
    navigate("/update-cropfield/" + id);
  };

  const handleAddParcelClick = () => {
    navigate(`/create-field-parcel?cropFieldId=${id}`);
  };

  const handleUpdateParcelClick = (fieldParcel: GetFieldParcelDTO) => {
    navigate(`/update-field-parcel/${fieldParcel.uid}?cropFieldId=${id}`);
  };

  const deleteSelectedParcel = (fieldParcelId: string) => {
    setActiveFieldParcelId(fieldParcelId);
    deleteMutate({ fieldParcelId, confirmUpdate: false });
  };

  const handleAddFieldWorkClick = () => {
    navigate(`/add-field-work/${id}`);
  };

  const handleFieldWorkDetailsClick = (fieldWorkId: string) => {
    navigate(`/field-work-details/${fieldWorkId}`);
  };

  const handleFieldWorkEditClick = (fieldWorkId: string) => {
    navigate(`/update-field-work/${fieldWorkId}`);
  };

  const handleParcelSelected = (index: number) => {
    const newParcelsSelected = parcelsSelected.map(
      (parcelSelected, parcelIndex) =>
        parcelIndex !== index ? parcelSelected : !parcelSelected,
    );

    console.log("Parcels selected: ", newParcelsSelected);
    setParcelsSelected([...newParcelsSelected]);
  };

  const handleConfirmUpdate = () => {
    deleteMutate({ fieldParcelId: activeFieldParcelId, confirmUpdate: true });
    setConfirmUpdateOpen(false);
  };

  const handleWorkDelete = (fieldWorkId: string) => {
    setWorkToDelete(fieldWorkId);
  };

  const handleConfirmWorkDelete = () => {
    if (workToDelete) {
      deleteFieldWorkMutate(workToDelete);
      setWorkToDelete(null);
    }
  };

  if (isUserLoading) {
    return <ProgressCircle loadingMessage="Initializing user data..." />;
  }

  if (isCropFieldLoading || !cropFieldDetail) {
    return (
      <Box>
        <MainHeader />
        <MainContainer>
          <ProgressCircle loadingMessage="Initializing crop field data..." />
        </MainContainer>
      </Box>
    );
  }

  if (userError) {
    if (userError.response?.status === 401) {
      navigate("/?error=unauthorized");
    }
  }

  return (
    <>
      <Box>
        <MainHeader />
        <MainContainer>
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

          <CropFieldInfoPanel
            cropFieldDetail={cropFieldDetail}
            isLoading={isFieldParcelsLoading}
            fieldParcels={fieldParcelsData || []}
            onAddParcelClick={handleAddParcelClick}
            onConfirmDelete={deleteSelectedParcel}
            onUpdateParcelClick={handleUpdateParcelClick}
            parcelsSelected={parcelsSelected}
            onParcelSelected={handleParcelSelected}
          />

          <CropFieldWorksPanel
            fieldWorks={onGoingWorks}
            title="Ongoing Works"
            placeholderText="You have no ongoing works at the moment"
            onDetailsClick={handleFieldWorkDetailsClick}
            onEditClick={handleFieldWorkEditClick}
            onDeleteClick={handleWorkDelete}
          />

          <CropFieldWorksPanel
            fieldWorks={scheduledWorks}
            title="Scheduled Works"
            placeholderText="You have no works scheduled"
            onDetailsClick={handleFieldWorkDetailsClick}
            onEditClick={handleFieldWorkEditClick}
            onDeleteClick={handleWorkDelete}
          />

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

          {confirmUpdateOpen && (
            <ConfirmCropFieldUpdateDialog
              open={confirmUpdateOpen}
              isPending={isDeletePending}
              numberOfOngoing={ongoingWorksNumber}
              numberOfScheduled={scheduledWorksNumber}
              onConfirmCancel={() => setConfirmUpdateOpen(false)}
              onConfirmUpdate={handleConfirmUpdate}
            />
          )}

          {workToDelete && (
            <DeleteFieldWorkDialog
              onConfirmDelete={handleConfirmWorkDelete}
              onConfirmCancel={() => setWorkToDelete(null)}
              isPending={isDeleteFieldWorkPending}
              open={!!workToDelete}
            />
          )}
        </MainContainer>
      </Box>
    </>
  );
}

export default PlotDetailsPage;
