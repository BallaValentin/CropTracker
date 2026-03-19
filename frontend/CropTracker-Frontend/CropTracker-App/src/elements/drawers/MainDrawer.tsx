import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import { useNavigate } from "react-router-dom";
import {
  COLLAPSED_DRAWER_WIDTH,
  EXPANDED_DRAWER_WIDTH,
} from "../../utils/Constants";
import { useDrawer } from "../../contexts/DrawerProvider";
import { useState } from "react";
import type { UserData } from "../../interfaces/response/UserData";

interface MainDrawerProps {
  userData: UserData | undefined;
}

function MainDrawer({ userData }: MainDrawerProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<boolean>(false);
  const userRoles = userData?.roles ?? [];

  const { isDrawerExpanded } = useDrawer();
  const drawerWidth =
    isDrawerExpanded || hovered
      ? EXPANDED_DRAWER_WIDTH
      : COLLAPSED_DRAWER_WIDTH;

  return (
    <Box>
      <Drawer
        anchor="left"
        variant="permanent"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          width: drawerWidth,
          whiteSpace: "nowrap",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            marginTop: "64px",
            boxSizing: "border-box",
            transition: "width 0.3s ease",
            overflowX: "hidden",
          },
        }}
      >
        <List>
          <ListItem key={"home"} disablePadding>
            <ListItemButton onClick={() => navigate("/")}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              {(isDrawerExpanded || hovered) && (
                <ListItemText>Home</ListItemText>
              )}
            </ListItemButton>
          </ListItem>
          {userRoles.findIndex((role) => role.name === "ADMIN") > -1 && (
            <ListItem key={"show-users"} disablePadding>
              <ListItemButton onClick={() => navigate("/show-users")}>
                <ListItemIcon>
                  <SupervisorAccountIcon />
                </ListItemIcon>
                {(isDrawerExpanded || hovered) && (
                  <ListItemText>Show Users</ListItemText>
                )}
              </ListItemButton>
            </ListItem>
          )}
          {userRoles.findIndex((role) => role.name === "GROWER") > -1 && (
            <ListItem key={"show-plots"} disablePadding>
              <ListItemButton onClick={() => navigate("/show-plots")}>
                <ListItemIcon>
                  <AgricultureIcon />
                </ListItemIcon>
                {(isDrawerExpanded || hovered) && (
                  <ListItemText>Show Plots</ListItemText>
                )}
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </Box>
  );
}

export default MainDrawer;
