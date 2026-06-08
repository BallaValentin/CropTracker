import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListSubheader,
  Typography,
} from "@mui/material";
import ColumnCenterContainer from "../containers/ColumnCenterContainer";
import type { GetFieldWorkDTO } from "../../interfaces/response/GetFieldWorkDTO";

interface CropFieldWorkPanelProps {
  fieldWorks: GetFieldWorkDTO[];
  title: string;
  placeholderText: string;
  onDetailsClick: (fieldWorkId: string) => void;
  onEditClick: (fieldWorkId: string) => void;
}

function CropFieldWorksPanel({
  fieldWorks,
  title,
  placeholderText,
  onDetailsClick,
  onEditClick,
}: CropFieldWorkPanelProps) {
  const handleDetailsClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    fieldWorkId: string,
  ) => {
    event.stopPropagation();
    onDetailsClick(fieldWorkId);
  };

  const handleEditClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    fieldWorkId: string,
  ) => {
    event.stopPropagation();
    onEditClick(fieldWorkId);
  };
  return (
    <Box
      sx={{
        width: "95%",
        height: fieldWorks && fieldWorks.length ? 300 : 250,
        mb: 5,
        display: "flex",
        overflowY: fieldWorks && fieldWorks.length ? "scroll" : "hidden",
        flexDirection: "column",
        gap: 1.5,
        pl: 1,
        pr: 1,
        pb: 1,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
      }}
    >
      {fieldWorks && fieldWorks.length > 0 ? (
        <List
          subheader={
            <ListSubheader
              sx={{
                pt: 1,
                fontWeight: "bold",
                lineHeight: "40px",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {title}
              </Typography>
              <Divider />
            </ListSubheader>
          }
        >
          {fieldWorks.map((work) => (
            <ListItemButton
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: "bold" }}
                >
                  {`${work.startDate.substring(0, 10)} ${work.startDate.substring(11, 16)}`}
                </Typography>

                <Typography>{work.workTypeName}</Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  onClick={(e) => handleDetailsClick(e, work.uid)}
                  color="success"
                >
                  Details
                </Button>
                <Button
                  onClick={(e) => handleEditClick(e, work.uid)}
                  color="success"
                >
                  Edit
                </Button>
              </Box>
            </ListItemButton>
          ))}
        </List>
      ) : (
        <ColumnCenterContainer>
          <Typography
            variant="h5"
            sx={{
              color: "text.secondary",
              fontWeight: "bold",
              fontStyle: "italic",
              letterSpacing: "0.02rem",
            }}
          >
            {placeholderText}
          </Typography>
        </ColumnCenterContainer>
      )}
    </Box>
  );
}

export default CropFieldWorksPanel;
