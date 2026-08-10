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
import GrassIcon from "@mui/icons-material/Grass";
import HistoryIcon from "@mui/icons-material/History";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import type { CacheUserData } from "../../interfaces/response/CacheUserData";
import { useSelection } from "../../contexts/MenuSelectProvider";

interface MainDrawerProps {
  userData: CacheUserData | undefined;
}

function MainDrawer({ userData }: MainDrawerProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<boolean>(false);
  const userRoles = userData?.roles ?? [];
  const { selectedOption, setSelectedOption } = useSelection();

  const { isDrawerExpanded } = useDrawer();
  const drawerWidth =
    isDrawerExpanded || hovered ? expandedDrawerWidth : collapsedDrawerWidth;

  const menuItems = [
    { role: "ALL", key: "home", label: "Home", page: "/", icon: <HomeIcon /> },
    {
      role: "ADMIN",
      key: "show-users",
      label: "Show Users",
      page: "/show-users",
      icon: <SupervisorAccountIcon />,
    },
    {
      role: "ADMIN",
      key: "show-crops",
      label: "Show Crops",
      page: "/show-crops",
      icon: <GrassIcon />,
    },
    {
      role: "GROWER",
      key: "show-cropfield",
      label: "Show Fields",
      page: "/show-cropfields",
      icon: <AgricultureIcon />,
    },
    {
      role: "GROWER",
      key: "work-history",
      label: "Work History",
      page: "/work-history",
      icon: <HistoryIcon />,
    },
    {
      role: "GROWER",
      key: "work-statistics",
      label: "Work Statistics",
      page: "/work-statistics",
      icon: <ShowChartIcon />,
    },
  ];

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
          {menuItems.map((menuItem, index) => {
            const hasAccess =
              menuItem["role"] === "ALL" ||
              userRoles.some((role) => role.name === menuItem["role"]);

            if (!hasAccess) return null;

            return (
              <ListItem key={menuItem["key"]} disablePadding>
                <ListItemButton
                  selected={selectedOption === index}
                  onClick={() => {
                    setSelectedOption(index);
                    navigate(menuItem["page"]);
                  }}
                >
                  <ListItemIcon>{menuItem["icon"]}</ListItemIcon>
                  {(isDrawerExpanded || hovered) && (
                    <ListItemText>{menuItem["label"]}</ListItemText>
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
          ,
        </List>
      </Drawer>
    </Box>
  );
}

export default MainDrawer;
