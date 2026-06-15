import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { updateCropField } from "../services/CropFieldService";
import type { UpdateCropFieldDTO } from "../interfaces/request/UpdateCropFieldDTO";
import { queryClient } from "../query-client/QueryClient";
import UpdateCropFieldForm from "../elements/forms/UpdateCropFieldForm";
import { useCropField } from "../hooks/UseCropField";
import { useCurrentProfile } from "../hooks/UseCurrentUser";

function UpdatePlotPage() {
  const { isLoading: isLoadingUser, error: userError } = useCurrentProfile();

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
    }: {
      cropFieldUpdateData: UpdateCropFieldDTO;
      id: string;
    }) => updateCropField(cropFieldUpdateData, id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cropfields", id] });
      navigate(`/cropfield-details/${id}`, {
        state: {
          success: true,
          message: "Field has been successfully updated",
        },
      });
    },
  });

  const handleOnUpdate = (cropFieldUpdateData: UpdateCropFieldDTO) => {
    mutate({ cropFieldUpdateData, id: id || "" });
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
      </MainContainer>
    </>
  );
}

export default UpdatePlotPage;
