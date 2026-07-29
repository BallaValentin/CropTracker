import { Box } from "@mui/material";
import ProgressCircle from "../elements/progress/ProgressCircle";
import MainHeader from "../elements/headers/MainHeader";
import MainContainer from "../elements/containers/MainContainer";
import { useCropCategories } from "../hooks/caching/UseCropCategories";
import CropsTreeView from "../elements/treeviews/CropsTreeView";
import { useLocation, useNavigate } from "react-router-dom";
import { useCurrentProfile } from "../hooks/caching/UseCurrentUser";
import { useEffect, useRef } from "react";
import { addSnackbar } from "../utils/SnackbarHelper";

function CropsListPage() {
  const { isLoading: isUserLoading, error: userError } = useCurrentProfile();
  const { data: cropCategories, isLoading: isLoadingCategories } =
    useCropCategories();
  const navigate = useNavigate();
  const location = useLocation();

  const feedbackRef = useRef<string | null>(null);

  useEffect(() => {
    const { success, message } = location.state || {};
    if (
      success &&
      message &&
      (!feedbackRef.current || feedbackRef.current !== location.key)
    ) {
      feedbackRef.current = location.key;
      addSnackbar(message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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
    addSnackbar(message);
  };

  return (
    <Box>
      <MainHeader />
      <MainContainer>
        <CropsTreeView
          cropCategories={categories}
          onOperationSuccess={handleOperationSuccess}
        />
      </MainContainer>
    </Box>
  );
}

export default CropsListPage;
