import { useNavigate, useSearchParams } from "react-router-dom";
import { useCropField } from "../hooks/caching/UseCropField";
import MainHeader from "../elements/headers/MainHeader";
import { Box, Typography } from "@mui/material";
import MainContainer from "../elements/containers/MainContainer";
import ProgressCircle from "../elements/progress/ProgressCircle";
import CreateFieldParcelForm from "../elements/forms/CreateFieldParcelForm";
import { useFieldParcels } from "../hooks/caching/UseFieldParcels";
import { queryClient } from "../query-client/QueryClient";
import { useMutation } from "@tanstack/react-query";
import { createFieldParcel } from "../services/FieldParcelService";
import type { CreateFieldParcelDTO } from "../interfaces/request/CreateFieldParcelDTO";
import { useState } from "react";
import type { ConfirmUpdateDTO } from "../interfaces/response/ConfirmUpdateDTO";
import ConfirmCropFieldUpdateDialog from "../elements/dialogs/ConfirmCropFieldUpdateDialog";

function CreateFieldParcelPage() {
  const [searchParams] = useSearchParams();
  const [confirmUpdateAlert, setConfirmUpdateAlert] = useState<boolean>(false);
  const [fieldParcelData, setFieldParcelData] =
    useState<CreateFieldParcelDTO | null>(null);
  const [ongoingWorks, setOngoingWorks] = useState<number>(0);
  const [scheduledWorks, setScheduledWorks] = useState<number>(0);

  const cropFieldId = searchParams.get("cropFieldId") || "";

  const { data: cropFieldData, isLoading: isLoadingCropField } = useCropField(
    cropFieldId,
    !!cropFieldId,
  );

  const { data: fieldParcelsData, isLoading: isLoadingFieldParcels } =
    useFieldParcels(cropFieldId, !!cropFieldId);

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      createFieldParcelData,
      confirmUpdate,
    }: {
      createFieldParcelData: CreateFieldParcelDTO;
      confirmUpdate: boolean;
    }) => createFieldParcel(createFieldParcelData, confirmUpdate),
    onSuccess: (data: ConfirmUpdateDTO | null) => {
      if (data?.confirmationRequired) {
        setConfirmUpdateAlert(true);
        setOngoingWorks(data.numberOfOngoing);
        setScheduledWorks(data.numberOfScheduled);
      } else {
        queryClient.invalidateQueries({
          queryKey: ["fieldParcels", cropFieldId],
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
            message: "Field parcel created successfully!",
            key: `${Date.now()}`,
          },
        });
      }
    },
  });

  const handleCreateParcel = (newFieldParcel: CreateFieldParcelDTO) => {
    setFieldParcelData(newFieldParcel);
    mutate({ createFieldParcelData: newFieldParcel, confirmUpdate: false });
  };

  const handleConfirmUpdate = () => {
    if (fieldParcelData) {
      mutate({ createFieldParcelData: fieldParcelData, confirmUpdate: true });
    }
    setConfirmUpdateAlert(false);
  };

  const handleCancel = () => {
    setConfirmUpdateAlert(false);
  };

  if (
    isLoadingCropField ||
    isLoadingFieldParcels ||
    !cropFieldData ||
    !fieldParcelsData
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
          onSubmit={handleCreateParcel}
          isPending={isPending}
          cropfield={cropFieldData}
          fieldParcels={fieldParcelsData}
        />

        {confirmUpdateAlert && (
          <ConfirmCropFieldUpdateDialog
            open={confirmUpdateAlert}
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

export default CreateFieldParcelPage;
