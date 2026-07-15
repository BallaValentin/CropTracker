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

function CreateFieldParcelPage() {
  const [searchParams] = useSearchParams();

  const cropFieldId = searchParams.get("cropFieldId") || "";

  const { data: cropFieldData, isLoading: isLoadingCropField } = useCropField(
    cropFieldId,
    !!cropFieldId,
  );

  const { data: fieldParcelsData, isLoading: isLoadingFieldParcels } =
    useFieldParcels(cropFieldId, !!cropFieldId);

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createFieldParcel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fieldParcels", cropFieldId],
      });
      queryClient.invalidateQueries({
        queryKey: ["cropfields", cropFieldId],
      });
      navigate(`/cropfield-details/${cropFieldId}`, {
        state: {
          success: true,
          message: "Field parcel created successfully!",
        },
      });
    },
  });

  const handleCreateParcel = (newFieldParcel: CreateFieldParcelDTO) => {
    mutate(newFieldParcel);
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
      </MainContainer>
    </Box>
  );
}

export default CreateFieldParcelPage;
