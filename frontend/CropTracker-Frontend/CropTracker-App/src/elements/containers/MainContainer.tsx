import { Box } from "@mui/material";
import { useDrawer } from "../../contexts/DrawerProvider";
import {
  collapsedDrawerWidth,
  expandedDrawerWidth,
} from "../../utils/Constants";
import { useCurrentProfile } from "../../hooks/caching/UseCurrentUser";
import { useRefreshToken } from "../../hooks/caching/UseRefreshToken";

interface MainContainerProps {
  children: React.ReactNode;
}

function MainContainer({ children }: MainContainerProps) {
  const { isDrawerExpanded } = useDrawer();

  const { isSuccess: isAuthVerified } = useRefreshToken();

  const { data: userData } = useCurrentProfile(isAuthVerified);

  const drawerWidth = userData
    ? isDrawerExpanded
      ? expandedDrawerWidth
      : collapsedDrawerWidth
    : 0;

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          width: `calc(100%  - ${drawerWidth}px + 1px)`,
          ml: `${drawerWidth + 1}px`,
          mt: 8,
          transition: "all 0.3s ease",
        }}
      >
        {children}
      </Box>
    </>
  );
}

export default MainContainer;
