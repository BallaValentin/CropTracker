import { Box } from "@mui/material";
import ProgressCircle from "../elements/progress/ProgressCircle";
import MainHeader from "../elements/headers/MainHeader";
import MainContainer from "../elements/containers/MainContainer";
import { useCropCategories } from "../hooks/UseCropCategories";
import CropsTreeView from "../elements/treeviews/CropsTreeView";
import { useNavigate } from "react-router-dom";
import { useCurrentProfile } from "../hooks/UseCurrentUser";

function CropsListPage() {
  const { isLoading: isUserLoading, error: userError } = useCurrentProfile();
  const { data: cropCategories, isLoading: isLoadingCategories } =
    useCropCategories();
  const navigate = useNavigate();

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

  return (
    <Box>
      <MainHeader />
      <MainContainer>
        <CropsTreeView cropCategories={categories} />
      </MainContainer>
    </Box>
  );
}

export default CropsListPage;
