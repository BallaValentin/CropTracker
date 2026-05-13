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
  collapsedDrawerWidth,
  expandedDrawerWidth,
} from "../../utils/Constants";
import { useDrawer } from "../../contexts/DrawerProvider";
import { useState } from "react";
import type { GetUserDTO } from "../../interfaces/response/GetUserDTO";
import GrassIcon from "@mui/icons-material/Grass";

interface MainDrawerProps {
  userData: GetUserDTO | undefined;
}

function MainDrawer({ userData }: MainDrawerProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<boolean>(false);
  const userRoles = userData?.roles ?? [];

  const { isDrawerExpanded } = useDrawer();
  const drawerWidth =
    isDrawerExpanded || hovered ? expandedDrawerWidth : collapsedDrawerWidth;

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
              <ListItemButton onClick={() => navigate("/show-cropfields")}>
                <ListItemIcon>
                  <AgricultureIcon />
                </ListItemIcon>
                {(isDrawerExpanded || hovered) && (
                  <ListItemText>Show Fields</ListItemText>
                )}
              </ListItemButton>
            </ListItem>
          )}
          {userRoles.findIndex((role) => role.name === "ADMIN") > -1 && (
            <ListItem key={"show-crops"} disablePadding>
              <ListItemButton onClick={() => navigate("/show-crops")}>
                <ListItemIcon>
                  <GrassIcon />
                </ListItemIcon>
                {(isDrawerExpanded || hovered) && (
                  <ListItemText>Show All Crops</ListItemText>
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
