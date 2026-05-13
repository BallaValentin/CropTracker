import { Box } from "@mui/material";
import { useUserProfile } from "../hooks/UseUserProfile";
import ProgressCircle from "../elements/progress/ProgressCircle";
import MainHeader from "../elements/headers/MainHeader";
import MainContainer from "../elements/containers/MainContainer";
import { useCropCategories } from "../hooks/UseCropCategories";
import CropsTreeView from "../elements/treeviews/CropsTreeView";

function CropsListPage() {
  const { data: user, isLoading: isUserLoading } = useUserProfile();
  const { data: cropCategories, isLoading: isLoadingCategories } =
    useCropCategories();

  if (isUserLoading) {
    return <ProgressCircle loadingMessage="Loading user data..." />;
  }

  if (isLoadingCategories) {
    return <ProgressCircle loadingMessage="Loading crop categories..." />;
  }

  const categories = cropCategories ?? [];

  return (
    <Box>
      <MainHeader userData={user} />
      <MainContainer hasDrawer={Boolean(user?.username)}>
        <CropsTreeView cropCategories={categories} />
      </MainContainer>
    </Box>
  );
}

export default CropsListPage;
