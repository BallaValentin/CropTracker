import { Box } from "@mui/material";
import ProgressCircle from "../elements/progress/ProgressCircle";
import MainHeader from "../elements/headers/MainHeader";
import MainContainer from "../elements/containers/MainContainer";
import { useUserProfile } from "../hooks/UseUserProfile";
import { useMutation } from "@tanstack/react-query";
import { createCropField } from "../services/CropFieldService";
import { useNavigate } from "react-router-dom";
import type { CreateCropFieldDTO } from "../interfaces/request/CreateCropFieldDTO";
import CreateCropFieldForm from "../elements/forms/CreateCropFieldForm";

function CreateCropFieldPage() {
  const { data: user, isLoading, error } = useUserProfile();
  const navigate = useNavigate();
  let authenticated = true;

  if (error) {
    authenticated = false;
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createCropField,
    onSuccess: () => {
      navigate("/show-cropfields", {
        state: {
          success: true,
          message: "New field has been successfully added",
        },
      });
    },
  });

  if (isLoading) {
    return <ProgressCircle loadingMessage="Loading your data..." />;
  }

  const createNewCropField = (createCropFieldData: CreateCropFieldDTO) => {
    mutate(createCropFieldData);
  };

  return (
    <>
      <Box>
        <MainHeader userData={user} authenticated={authenticated} />
        <MainContainer hasDrawer={authenticated}>
          <CreateCropFieldForm
            isPending={isPending}
            onSubmit={(createCropFieldData) => {
              createNewCropField(createCropFieldData);
            }}
          />
        </MainContainer>
      </Box>
    </>
  );
}

export default CreateCropFieldPage;
