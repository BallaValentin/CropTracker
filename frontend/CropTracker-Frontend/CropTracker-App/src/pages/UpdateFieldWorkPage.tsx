import { useEffect, useState } from "react";
import type { GetCropFieldDTO } from "../interfaces/response/GetCropFieldDTO";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCropFieldByFieldWorkId } from "../services/CropFieldService";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { Box, Button } from "@mui/material";
import MainHeader from "../elements/headers/MainHeader";
import MainContainer from "../elements/containers/MainContainer";
import { useFieldParcels } from "../hooks/caching/UseFieldParcels";
import type { GetFieldParcelDTO } from "../interfaces/response/GetFieldParcelDTO";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { type GetWorkTypeDTO } from "../interfaces/response/GetWorkTypeDTO";
import { useWorkTypes } from "../hooks/caching/UseWorkTypes";
import { updateFieldWork } from "../services/FieldWorkService";
import type { CreateFieldWorkDTO } from "../interfaces/request/CreateFieldWorkDTO";
import { createWorkType } from "../services/WorkTypeService";
import { queryClient } from "../query-client/QueryClient";
import type { CreateWorkTypeDTO } from "../interfaces/request/CreateWorkTypeDTO";
import UpdateFieldWorkForm from "../elements/forms/UpdateFieldWorkForm";
import type { UpdateFieldWorkDTO } from "../interfaces/request/UpdateFieldWorkDTO";
import { useFieldWork } from "../hooks/caching/UseFieldWork";
import { useCurrentProfile } from "../hooks/caching/UseCurrentUser";

function UpdateFieldWorkPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cropField, setCropField] = useState<GetCropFieldDTO | null>(null);
  const [fieldParcels, setFieldParcels] = useState<GetFieldParcelDTO[]>([]);
  const [workTypes, setWorkTypes] = useState<GetWorkTypeDTO[]>([]);

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentProfile();

  const { data: fieldWorkData, isLoading: isFieldWorkLoading } = useFieldWork(
    id || "",
    !!id && !!user,
  );

  const { data: cropFieldData, isLoading: isCropFieldLoading } = useQuery({
    queryKey: ["cropfields", id],
    queryFn: () => getCropFieldByFieldWorkId(fieldWorkData?.uid || ""),
    staleTime: 0,
    enabled: !!fieldWorkData?.uid,
    refetchInterval: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateFieldWorkDTO) => updateFieldWork(data, id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fieldWorks", cropFieldData?.uid],
      });
      queryClient.invalidateQueries({
        queryKey: ["fieldWork", id],
      });
      navigate(`/cropfield-details/${cropFieldData?.uid}`, {
        state: {
          success: true,
          message: "Field work updated successfully!",
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
    navigate(`/cropfield-details/${cropFieldData?.uid}`);
  };

  const { data: fieldParcelsData, isLoading: isFieldParcelsLoading } =
    useFieldParcels(cropFieldData?.uid || "", !!cropFieldData?.uid);

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
    isFieldWorkLoading ||
    !fieldWorkData ||
    isCropFieldLoading ||
    isFieldParcelsLoading ||
    isWorkTypesLoading
  ) {
    return <ProgressCircle loadingMessage="Initializing data..." />;
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
          <Button
            color="success"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
          >
            Back to {cropField?.name}
          </Button>

          {cropField && fieldParcels && workTypes.length > 0 && (
            <UpdateFieldWorkForm
              fieldWorkData={fieldWorkData}
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

export default UpdateFieldWorkPage;
