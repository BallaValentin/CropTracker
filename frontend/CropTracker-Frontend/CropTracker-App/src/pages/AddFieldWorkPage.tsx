import { useEffect, useState } from "react";
import type { GetCropFieldDTO } from "../interfaces/response/GetCropFieldDTO";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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

function AddFieldWorkPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cropField, setCropField] = useState<GetCropFieldDTO | null>(null);
  const [fieldParcels, setFieldParcels] = useState<GetFieldParcelDTO[]>([]);

  const { data: user, isLoading: isUserLoading } = useUserProfile();

  const { data: cropFieldData, isLoading: isCropFieldLoading } = useQuery({
    queryKey: ["cropfields", id],
    queryFn: () => getCropFieldById(id || ""),
    staleTime: 0,
    enabled: !!id,
    refetchInterval: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

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

  if (isUserLoading || isCropFieldLoading || isFieldParcelsLoading) {
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

          {cropField && fieldParcels && (
            <AddFieldWorkForm
              cropField={cropField}
              fieldParcels={fieldParcels}
            />
          )}
        </MainContainer>
      </Box>
    </>
  );
}

export default AddFieldWorkPage;
