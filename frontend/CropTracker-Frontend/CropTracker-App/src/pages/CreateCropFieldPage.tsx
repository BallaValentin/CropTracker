import { Box } from "@mui/material";
import MainHeader from "../elements/headers/MainHeader";
import MainContainer from "../elements/containers/MainContainer";
import { useMutation } from "@tanstack/react-query";
import { createCropField } from "../services/CropFieldService";
import { useNavigate } from "react-router-dom";
import type { CreateCropFieldDTO } from "../interfaces/request/CreateCropFieldDTO";
import CreateCropFieldForm from "../elements/forms/CreateCropFieldForm";
import { queryClient } from "../query-client/QueryClient";
import { useCurrentProfile } from "../hooks/caching/UseCurrentUser";
import { useTranslation } from "react-i18next";

function CreateCropFieldPage() {
  const { t } = useTranslation();

  const { error: userError } = useCurrentProfile();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: createCropField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cropfields"] });
      navigate("/show-cropfields", {
        state: {
          success: true,
          message: t("pages.createCropFieldPage.successMessage", {
            defaultValue: "Crop field has been successully added.",
          }),
          key: `${Date.now()}`,
        },
      });
    },
  });

  if (userError) {
    if (userError.response?.status === 401) {
      navigate("/?error=unauthorized");
    }
  }

  const createNewCropField = (createCropFieldData: CreateCropFieldDTO) => {
    mutate(createCropFieldData);
  };

  return (
    <>
      <Box>
        <MainHeader />
        <MainContainer>
          <CreateCropFieldForm
            isPending={isPending}
            onSubmit={createNewCropField}
          />
        </MainContainer>
      </Box>
    </>
  );
}

export default CreateCropFieldPage;
