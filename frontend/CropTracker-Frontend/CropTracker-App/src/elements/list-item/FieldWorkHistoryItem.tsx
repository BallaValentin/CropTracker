import { Box, Button, Checkbox, Divider, Typography } from "@mui/material";
import type { GetPreviousWorkDTO } from "../../interfaces/response/GetPreviousWorkDTO";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface FieldWorkItemProps {
  fieldWork: GetPreviousWorkDTO;
  onItemCheck: (fieldWorkId: string, isChecked: boolean) => void;
}

function FieldWorkHistoryItem({ fieldWork, onItemCheck }: FieldWorkItemProps) {
  const { t } = useTranslation();

  const [itemChecked, setItemChecked] = useState<boolean>(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setItemChecked(isChecked);
    onItemCheck(fieldWork.uid, isChecked);
  };

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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            checked={itemChecked}
            onChange={handleCheckboxChange}
            sx={{ mr: 1 }}
          />
          <Typography
            variant="subtitle1"
            color="textSecondary"
            fontSize={"medium"}
            sx={{ fontStyle: "italic", fontWeight: "bold" }}
          >
            {fieldWork.startDate.substring(11, 16)}
          </Typography>
          {fieldWork.endDate ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Divider
                sx={{
                  width: 8,
                  borderBottomWidth: 2,
                  mx: 0.75,
                  bgcolor: "text.secondary",
                }}
              />
              <Typography
                variant="subtitle1"
                color="textSecondary"
                fontSize={"medium"}
                sx={{ fontStyle: "italic", fontWeight: "bold" }}
              >
                {fieldWork.endDate.substring(11, 16)}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "block", width: "7ch" }} />
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
            {t(
              `elements.forms.addFieldWorkForm.systemWorkTypes.${fieldWork.workTypeName}.name`,
              {
                defaultValue: fieldWork.workTypeName,
              },
            )}
          </Typography>
        </Box>
      </Box>

      <Button
        color="success"
        component={Link}
        to={`/field-work-details/${fieldWork.uid}`}
      >
        {t("elements.listItems.fieldWorkHistoryItem.detailsButton", {
          defaultValue: "View Details",
        })}
      </Button>
    </Box>
  );
}

export default FieldWorkHistoryItem;
