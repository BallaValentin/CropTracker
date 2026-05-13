import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useUserProfile } from "../hooks/UseUserProfile";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCropFieldById,
  updateCropField,
} from "../services/CropFieldService";
import type { GetCropFieldDTO } from "../interfaces/response/GetCropFieldDTO";
import { useEffect, useState } from "react";
import type { UpdateCropFieldDTO } from "../interfaces/request/UpdateCropFieldDTO";
import { queryClient } from "../query-client/QueryClient";
import UpdateCropFieldForm from "../elements/forms/UpdateCropFieldForm";

function UpdatePlotPage() {
  const { data: user, isLoading: isLoadingUser } = useUserProfile();
  const [cropFieldDetail, setCropFieldDetail] = useState<GetCropFieldDTO>({
    uid: "",
    name: "Unnamed Field",
    markerPosition: {
      lat: 51.505,
      lng: -0.09,
    },
    polygonPoints: [],
    fieldParcels: [],
    area: 0,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: cropField, isLoading: isCropFieldLoading } = useQuery({
    queryKey: ["plots", id],
    queryFn: () => getCropFieldById(id || ""),
    staleTime: 1000 * 60 * 60,
    enabled: !!id,
    refetchInterval: 1000 * 60 * 60,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (cropField) {
      setCropFieldDetail(cropField);
    }
  }, [cropField]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      cropFieldUpdateData,
      id,
    }: {
      cropFieldUpdateData: UpdateCropFieldDTO;
      id: string;
    }) => updateCropField(cropFieldUpdateData, id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plots", id] });
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

  if (isCropFieldLoading) {
    return <ProgressCircle loadingMessage="Loading field details" />;
  }

  return (
    <>
      <MainHeader userData={user} />
      <MainContainer hasDrawer={Boolean(user?.username)}>
        <UpdateCropFieldForm
          cropField={cropFieldDetail}
          onUpdate={handleOnUpdate}
          isPending={isPending}
        />
      </MainContainer>
    </>
  );
}

export default UpdatePlotPage;
