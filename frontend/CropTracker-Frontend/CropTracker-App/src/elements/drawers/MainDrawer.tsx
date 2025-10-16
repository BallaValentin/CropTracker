import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

interface MainDrawerProps {
  isOpen: boolean;
  handleClose: () => void;
  handleClick: () => void;
}

function MainDrawer({ isOpen, handleClose, handleClick }: MainDrawerProps) {
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
              <ListItemButton>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText>Home</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

export default MainDrawer;
