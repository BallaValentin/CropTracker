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
import { useNavigate } from "react-router-dom";

interface MainDrawerProps {
  isOpen: boolean;
  handleClose: () => void;
  handleClick: () => void;
}

function MainDrawer({ isOpen, handleClose, handleClick }: MainDrawerProps) {
  const navigate = useNavigate();

  const navigateToMainPage = () => {
    navigate("/");
  };

  const navigateToShowUsers = () => {
    navigate("/show-users");
  };

  return (
    <Box>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={handleClose}
        sx={{
          "& .MuiDrawer-paper": {
            marginTop: "64px",
          },
        }}
      >
        <Box sx={{ width: 250 }} role="presentation" onClick={handleClick}>
          <List>
            <ListItem key={"home"} disablePadding>
              <ListItemButton onClick={navigateToMainPage}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText>Home</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem key={"show users"} disablePadding>
              <ListItemButton onClick={navigateToShowUsers}>
                <ListItemIcon>
                  <SupervisorAccountIcon />
                </ListItemIcon>
                <ListItemText>Show Users</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

export default MainDrawer;
