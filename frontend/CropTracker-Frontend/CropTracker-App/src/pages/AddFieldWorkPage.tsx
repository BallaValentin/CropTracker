import { useEffect, useState } from "react";
import type { GetCropFieldDTO } from "../interfaces/response/GetCropFieldDTO";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
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
import { createWorkType } from "../services/WorkTypeService";
import { queryClient } from "../query-client/QueryClient";
import type { CreateWorkTypeDTO } from "../interfaces/request/CreateWorkTypeDTO";
import { useCropField } from "../hooks/UseCropField";

function AddFieldWorkPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cropField, setCropField] = useState<GetCropFieldDTO | null>(null);
  const [fieldParcels, setFieldParcels] = useState<GetFieldParcelDTO[]>([]);
  const [workTypes, setWorkTypes] = useState<GetWorkTypeDTO[]>([]);

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useUserProfile();

  const { data: cropFieldData, isLoading: isCropFieldLoading } = useCropField(
    id || "",
    !!id,
  );

  const { mutate, isPending } = useMutation({
    mutationFn: createFieldWork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fieldWorks"] });
      navigate(`/cropfield-details/${id}`, {
        state: {
          success: true,
          message: "Field work created successfully!",
        },
      });
    },
  });

  const { mutate: workTypeMutate } = useMutation({
    mutationFn: createWorkType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workTypes"] });
    },
  });

  const handleCreateFieldWork = (createFieldWorkDTO: CreateFieldWorkDTO) => {
    mutate(createFieldWorkDTO);
  };

  const handleCreateWorkType = (createWorkTypeDTO: CreateWorkTypeDTO) => {
    workTypeMutate(createWorkTypeDTO);
  };

  const { data: workTypesData, isLoading: isWorkTypesLoading } = useWorkTypes();

  const handleGoBack = () => {
    navigate(`/cropfield-details/${id}`);
  };

  const { data: fieldParcelsData, isLoading: isFieldParcelsLoading } =
    useFieldParcels(id || "", !!id);

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

  if (userError) {
    if (userError.response?.status === 401) {
      navigate("/?error=unauthorized");
    }
  }

  if (isUserLoading) {
    return <ProgressCircle loadingMessage="Initializing user data..." />;
  }

  if (isCropFieldLoading || isFieldParcelsLoading || isWorkTypesLoading) {
    return (
      <Box>
        <MainHeader userData={user} />
        <MainContainer hasDrawer={Boolean(user?.username)}>
          <ProgressCircle loadingMessage="Initializing data..." />
        </MainContainer>
      </Box>
    );
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
              onWorkTypeAdded={handleCreateWorkType}
              isPending={isPending}
            />
          )}
        </MainContainer>
      </Box>
    </>
  );
}

export default AddFieldWorkPage;
