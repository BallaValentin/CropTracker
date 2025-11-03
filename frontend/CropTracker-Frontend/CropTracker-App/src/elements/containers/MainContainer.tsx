import { Box } from "@mui/material";
import { useDrawer } from "../../contexts/DrawerProvider";
import {
  COLLAPSED_DRAWER_WIDTH,
  EXPANDED_DRAWER_WIDTH,
} from "../../utils/constants";

interface MainContainerProps {
  children: React.ReactNode;
  hasDrawer: boolean;
}

function MainContainer({ children, hasDrawer }: MainContainerProps) {
  const { isDrawerExpanded } = useDrawer();
  const drawerWidth = hasDrawer
    ? isDrawerExpanded
      ? EXPANDED_DRAWER_WIDTH
      : COLLAPSED_DRAWER_WIDTH
    : 0;

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
          width: `calc(100%  - ${drawerWidth}px + 1px)`,
          ml: `${drawerWidth + 1}px`,
          mt: 8.5,
          transition: "all 0.3s ease",
        }}
      >
        {children}
      </Box>
    </>
  );
}

export default MainContainer;
