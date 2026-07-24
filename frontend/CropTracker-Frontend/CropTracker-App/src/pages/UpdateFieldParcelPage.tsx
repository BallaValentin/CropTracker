import { Box, Typography } from "@mui/material";
import MainContainer from "../elements/containers/MainContainer";
import CreateFieldParcelForm from "../elements/forms/CreateFieldParcelForm";
import MainHeader from "../elements/headers/MainHeader";
import ProgressCircle from "../elements/progress/ProgressCircle";
import type { UpdateFieldParcelDTO } from "../interfaces/request/UpdateFieldParcelDTO";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useCropField } from "../hooks/caching/UseCropField";
import { useFieldParcels } from "../hooks/caching/UseFieldParcels";
import { queryClient } from "../query-client/QueryClient";
import { updateFieldParcel } from "../services/FieldParcelService";
import { useMutation } from "@tanstack/react-query";
import { useFieldParcel } from "../hooks/caching/UseFieldParcel";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import { useEffect, useState } from "react";
import type { ConfirmUpdateDTO } from "../interfaces/response/ConfirmUpdateDTO";
import ConfirmCropFieldUpdateDialog from "../elements/dialogs/ConfirmCropFieldUpdateDialog";

function UpdateFieldParcelPage() {
  const [searchParams] = useSearchParams();
  const [fieldParcels, setFieldParcels] = useState<GetFieldParcelDTO[] | null>(
    null,
  );
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState<boolean>(false);
  const [scheduledWorks, setScheduledWorks] = useState<number>(0);
  const [ongoingWorks, setOngoingWorks] = useState<number>(0);
  const [fieldParcelUpdates, setFieldParcelUpdates] =
    useState<UpdateFieldParcelDTO | null>(null);

  const cropFieldId = searchParams.get("cropFieldId") || "";

  const { id } = useParams() || "";

  const { data: cropFieldData, isLoading: isLoadingCropField } = useCropField(
    cropFieldId,
    !!cropFieldId,
  );

  const { data: fieldParcelsData, isLoading: isLoadingFieldParcels } =
    useFieldParcels(cropFieldId, !!cropFieldId);

  useEffect(() => {
    if (fieldParcelsData && !!id) {
      setFieldParcels(fieldParcelsData.filter((parcel) => parcel.uid !== id));
    }
  }, [fieldParcelsData, id]);

  const { data: fieldParcelData, isLoading: isLaodingFieldParcel } =
    useFieldParcel(id || "", !!id);

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      fieldParcelId,
      fieldParcelUpdateData,
      confirmUpdate,
    }: {
      fieldParcelId: string;
      fieldParcelUpdateData: UpdateFieldParcelDTO;
      confirmUpdate: boolean;
    }) =>
      updateFieldParcel(fieldParcelUpdateData, fieldParcelId, confirmUpdate),
    onSuccess: (data: ConfirmUpdateDTO | null) => {
      if (data?.confirmationRequired) {
        setConfirmUpdateOpen(true);
        setScheduledWorks(data.numberOfScheduled);
        setOngoingWorks(data.numberOfOngoing);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["fieldParcels", cropFieldId],
        });
        queryClient.invalidateQueries({
          queryKey: ["fieldParcels", id],
        });
        queryClient.invalidateQueries({
          queryKey: ["cropfields", cropFieldId],
        });
        queryClient.invalidateQueries({
          queryKey: ["fieldWorks", cropFieldId],
        });
        queryClient.invalidateQueries({
          queryKey: ["fieldWork"],
        });
        navigate(`/cropfield-details/${cropFieldId}`, {
          state: {
            success: true,
            message: "Field parcel updated successfully!",
          },
        });
      }
    },
  });

  const handleUpdateParcel = (fieldParcelUpdateData: UpdateFieldParcelDTO) => {
    setFieldParcelUpdates(fieldParcelUpdateData);
    mutate({
      fieldParcelUpdateData,
      fieldParcelId: id || "",
      confirmUpdate: false,
    });
  };

  const handleCancel = () => {
    setConfirmUpdateOpen(false);
  };

  const handleConfirmUpdate = () => {
    if (fieldParcelUpdates) {
      mutate({
        fieldParcelUpdateData: fieldParcelUpdates,
        fieldParcelId: id || "",
        confirmUpdate: true,
      });
    }
    setConfirmUpdateOpen(false);
  };

  if (
    isLoadingCropField ||
    isLoadingFieldParcels ||
    isLaodingFieldParcel ||
    !cropFieldData ||
    !cropFieldData.polygonPoints ||
    !fieldParcels ||
    !fieldParcelData ||
    !fieldParcelData.polygonPoints
  ) {
    return (
      <Box>
        <MainHeader />
        <MainContainer>
          <ProgressCircle loadingMessage="Loading crop field details" />
        </MainContainer>
      </Box>
    );
  }

  return (
    <Box>
      <MainHeader />
      <MainContainer>
        <Typography
          variant="h4"
          component={"h1"}
          sx={{
            mb: 2,
            color: "success.main",
            fontWeight: "bold",
            letterSpacing: "0.02em",
            lineHeight: 1.6,
          }}
        >
          {cropFieldData.name}
        </Typography>

        <CreateFieldParcelForm
          fieldParcelToUpdate={fieldParcelData}
          onSubmit={handleUpdateParcel}
          isPending={isPending}
          cropfield={cropFieldData}
          fieldParcels={fieldParcels}
        />

        {confirmUpdateOpen && (
          <ConfirmCropFieldUpdateDialog
            open={confirmUpdateOpen}
            isPending={isPending}
            numberOfOngoing={ongoingWorks}
            numberOfScheduled={scheduledWorks}
            onConfirmCancel={handleCancel}
            onConfirmUpdate={handleConfirmUpdate}
          />
        )}
      </MainContainer>
    </Box>
  );
}

export default UpdateFieldParcelPage;
