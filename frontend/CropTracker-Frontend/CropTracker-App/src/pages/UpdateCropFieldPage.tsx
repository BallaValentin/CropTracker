import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { updateCropField } from "../services/CropFieldService";
import type { UpdateCropFieldDTO } from "../interfaces/request/UpdateCropFieldDTO";
import { queryClient } from "../query-client/QueryClient";
import UpdateCropFieldForm from "../elements/forms/UpdateCropFieldForm";
import { useCropField } from "../hooks/caching/UseCropField";
import { useCurrentProfile } from "../hooks/caching/UseCurrentUser";
import type { ConfirmUpdateDTO } from "../interfaces/response/ConfirmUpdateDTO";
import ConfirmCropFieldUpdateDialog from "../elements/dialogs/ConfirmCropFieldUpdateDialog";
import { useState } from "react";

function UpdatePlotPage() {
  const { isLoading: isLoadingUser, error: userError } = useCurrentProfile();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [scheduledWorks, setScheduledWorks] = useState<number>(0);
  const [ongoingWorks, setOngoingWorks] = useState<number>(0);
  const [cropFieldUpdateData, setCropFieldUpdateData] =
    useState<UpdateCropFieldDTO | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: cropField, isLoading: isCropFieldLoading } = useCropField(
    id || "",
    !!id,
  );

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      cropFieldUpdateData,
      id,
      confirmUpdate,
    }: {
      cropFieldUpdateData: UpdateCropFieldDTO;
      id: string;
      confirmUpdate: boolean;
    }) => updateCropField(cropFieldUpdateData, id || "", confirmUpdate),
    onSuccess: (data: ConfirmUpdateDTO | null) => {
      if (data?.confirmationRequired) {
        setScheduledWorks(data.numberOfScheduled);
        setOngoingWorks(data.numberOfOngoing);
        setConfirmDialogOpen(true);
      } else {
        queryClient.invalidateQueries({ queryKey: ["cropfields", id] });
        queryClient.invalidateQueries({
          queryKey: ["fieldWorks", id],
        });
        queryClient.invalidateQueries({
          queryKey: ["fieldWork"],
        });
        navigate(`/cropfield-details/${id}`, {
          state: {
            success: true,
            message: "Field has been successfully updated",
            key: `${Date.now()}`,
          },
        });
      }
    },
  });

  const handleOnUpdate = (cropFieldUpdateData: UpdateCropFieldDTO) => {
    setCropFieldUpdateData(cropFieldUpdateData);
    mutate({ cropFieldUpdateData, id: id || "", confirmUpdate: false });
  };

  const handleCancel = () => {
    setConfirmDialogOpen(false);
  };

  const handleConfirmUpdate = () => {
    if (cropFieldUpdateData) {
      mutate({ cropFieldUpdateData, id: id || "", confirmUpdate: true });
    }
    setConfirmDialogOpen(false);
  };

  if (isLoadingUser) {
    return <ProgressCircle loadingMessage="Loading user data" />;
  }

  if (
    isCropFieldLoading ||
    !cropField ||
    !cropField.markerPosition ||
    !cropField.polygonPoints
  ) {
    return <ProgressCircle loadingMessage="Loading field details" />;
  }

  if (userError) {
    if (userError.response?.status === 401) {
      navigate("/?error=unauthorized");
    }
  }

  return (
    <>
      <MainHeader />
      <MainContainer>
        <UpdateCropFieldForm
          cropField={cropField}
          onUpdate={handleOnUpdate}
          isPending={isPending}
        />
        {confirmDialogOpen && (
          <ConfirmCropFieldUpdateDialog
            open={confirmDialogOpen}
            isPending={isPending}
            numberOfOngoing={ongoingWorks}
            numberOfScheduled={scheduledWorks}
            onConfirmCancel={handleCancel}
            onConfirmUpdate={handleConfirmUpdate}
          />
        )}
      </MainContainer>
    </>
  );
}

export default UpdatePlotPage;
