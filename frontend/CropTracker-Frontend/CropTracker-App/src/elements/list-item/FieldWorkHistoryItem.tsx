import { Box, Button, Divider, Typography } from "@mui/material";
import type { GetPreviousWorkDTO } from "../../interfaces/response/GetPreviousWorkDTO";
import { Link } from "react-router-dom";

interface FieldWorkItemProps {
  fieldWork: GetPreviousWorkDTO;
}

function FieldWorkHistoryItem({ fieldWork }: FieldWorkItemProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        alignContent: "center",
      }}
    >
      <Box sx={{ display: "flex", gap: 5 }}>
        <Box sx={{ display: "flex" }}>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            fontSize={"medium"}
            sx={{ fontStyle: "italic", fontWeight: "bold" }}
          >
            {fieldWork.startDate.substring(11, 16)}
          </Typography>
          {fieldWork.endDate ? (
            <Typography
              variant="subtitle1"
              color="textSecondary"
              fontSize={"medium"}
              sx={{ fontStyle: "italic", fontWeight: "bold" }}
            >
              -{fieldWork.endDate.substring(11, 16)}
            </Typography>
          ) : (
            <Box sx={{ display: "block", width: "6ch" }} />
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography>{fieldWork.cropFieldName}</Typography>
          <Divider
            sx={{
              width: 16,
              borderBottomWidth: 1,
              mx: 0.75,
              bgcolor: "black",
            }}
          />
          <Typography
            variant="caption"
            fontSize={"medium"}
            sx={{ fontWeight: "bold" }}
          >
            {fieldWork.workTypeName}
          </Typography>
        </Box>
      </Box>

      <Button
        color="success"
        component={Link}
        to={`/field-work-details/${fieldWork.uid}`}
      >
        View Details
      </Button>
    </Box>
  );
}

export default FieldWorkHistoryItem;
