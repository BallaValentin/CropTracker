import { Box } from "@mui/material";
import { useDrawer } from "../../contexts/DrawerProvider";
import {
  collapsedDrawerWidth,
  expandedDrawerWidth,
} from "../../utils/Constants";
import { useCurrentProfile } from "../../hooks/UseCurrentUser";

interface MainContainerProps {
  fetchUser?: boolean;
  children: React.ReactNode;
}

function MainContainer({ fetchUser = true, children }: MainContainerProps) {
  const { isDrawerExpanded } = useDrawer();
  const { data: userData } = useCurrentProfile(fetchUser);
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
