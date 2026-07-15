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

function UpdateFieldParcelPage() {
  const [searchParams] = useSearchParams();
  const [fieldParcels, setFieldParcels] = useState<GetFieldParcelDTO[] | null>(
    null,
  );

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
    }: {
      fieldParcelId: string;
      fieldParcelUpdateData: UpdateFieldParcelDTO;
    }) => updateFieldParcel(fieldParcelUpdateData, fieldParcelId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fieldParcels", cropFieldId],
      });
      queryClient.invalidateQueries({
        queryKey: ["fieldParcels", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["cropfields", cropFieldId],
      });
      navigate(`/cropfield-details/${cropFieldId}`, {
        state: {
          success: true,
          message: "Field parcel updated successfully!",
        },
      });
    },
  });

  const handleUpdateParcel = (fieldParcelUpdateData: UpdateFieldParcelDTO) => {
    mutate({ fieldParcelUpdateData, fieldParcelId: id || "" });
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
      </MainContainer>
    </Box>
  );
}

export default UpdateFieldParcelPage;
