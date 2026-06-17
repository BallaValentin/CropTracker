import { Alert, Box } from "@mui/material";
import ProgressCircle from "../elements/progress/ProgressCircle";
import MainHeader from "../elements/headers/MainHeader";
import MainContainer from "../elements/containers/MainContainer";
import { useCropCategories } from "../hooks/caching/UseCropCategories";
import CropsTreeView from "../elements/treeviews/CropsTreeView";
import { useNavigate } from "react-router-dom";
import { useCurrentProfile } from "../hooks/caching/UseCurrentUser";
import { useEffect, useState } from "react";

function CropsListPage() {
  const { isLoading: isUserLoading, error: userError } = useCurrentProfile();
  const { data: cropCategories, isLoading: isLoadingCategories } =
    useCropCategories();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 6000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  if (isUserLoading) {
    return <ProgressCircle loadingMessage="Loading user data..." />;
  }

  if (isLoadingCategories) {
    return <ProgressCircle loadingMessage="Loading crop categories..." />;
  }

  const categories = cropCategories ?? [];

  if (userError) {
    if (userError.response?.status === 401) {
      navigate("/?error=unauthorized");
    }
  }

  const handleOperationSuccess = (message: string) => {
    setSuccessMessage(message);
  };

  return (
    <Box>
      <MainHeader />
      <MainContainer>
        {successMessage && <Alert color="success">{successMessage}</Alert>}
        <CropsTreeView
          cropCategories={categories}
          onOperationSuccess={handleOperationSuccess}
        />
      </MainContainer>
    </Box>
  );
}

export default CropsListPage;
