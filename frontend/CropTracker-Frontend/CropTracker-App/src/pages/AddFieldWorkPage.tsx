import { useEffect, useState } from "react";
import type { GetCropFieldDTO } from "../interfaces/response/GetCropFieldDTO";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCropFieldById } from "../services/CropFieldService";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useUserProfile } from "../hooks/UseUserProfile";
import { Box, Button } from "@mui/material";
import MainHeader from "../elements/headers/MainHeader";
import MainContainer from "../elements/containers/MainContainer";
import { useFieldParcels } from "../hooks/UseFieldParcels";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddFieldWorkForm from "../elements/forms/AddFieldWorkForm";
import { type GetWorkTypeDTO } from "../interfaces/response/GetWorkTypeDTO";
import { useWorkTypes } from "../hooks/UseWorkTypes";
import { createFieldWork } from "../services/FieldWorkService";
import type { CreateFieldWorkDTO } from "../interfaces/request/CreateFieldWorkDTO";

function AddFieldWorkPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cropField, setCropField] = useState<GetCropFieldDTO | null>(null);
  const [fieldParcels, setFieldParcels] = useState<GetFieldParcelDTO[]>([]);
  const [workTypes, setWorkTypes] = useState<GetWorkTypeDTO[]>([]);

  const { data: user, isLoading: isUserLoading } = useUserProfile();

  const { data: cropFieldData, isLoading: isCropFieldLoading } = useQuery({
    queryKey: ["cropfields", id],
    queryFn: () => getCropFieldById(id || ""),
    staleTime: 0,
    enabled: !!id,
    refetchInterval: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createFieldWork,
    onSuccess: () => {
      navigate(`/cropfield-details/${id}`, {
        state: {
          showSuccessSnackbar: true,
          successSnackbarMessage: "Field work created successfully!",
        },
      });
    },
  });

  const handleCreateFieldWork = (createFieldWorkDTO: CreateFieldWorkDTO) => {
    mutate(createFieldWorkDTO);
  };

  const { data: workTypesData, isLoading: isWorkTypesLoading } = useWorkTypes();

  const handleGoBack = () => {
    navigate(`/cropfield-details/${id}`);
  };

  const { data: fieldParcelsData, isLoading: isFieldParcelsLoading } =
    useFieldParcels(id || "");

  useEffect(() => {
    if (fieldParcelsData) {
      setFieldParcels(fieldParcelsData);
    }
  }, [fieldParcelsData]);

  useEffect(() => {
    if (cropFieldData) {
      setCropField(cropFieldData);
    }
  }, [cropFieldData]);

  useEffect(() => {
    if (workTypesData) {
      setWorkTypes(workTypesData);
    }
  }, [workTypesData]);

  if (
    isUserLoading ||
    isCropFieldLoading ||
    isFieldParcelsLoading ||
    isWorkTypesLoading
  ) {
    return <ProgressCircle loadingMessage="Initializing data..." />;
  }

  return (
    <>
      <Box>
        <MainHeader userData={user} />
        <MainContainer hasDrawer={Boolean(user?.username)}>
          <Button
            color="success"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
          >
            Back to {cropField?.name}
          </Button>

          {cropField && fieldParcels && workTypes.length > 0 && (
            <AddFieldWorkForm
              cropField={cropField}
              fieldParcels={fieldParcels}
              workTypes={workTypes}
              onSubmit={handleCreateFieldWork}
            />
          )}
        </MainContainer>
      </Box>
    </>
  );
}

export default AddFieldWorkPage;
