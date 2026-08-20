import {
  Box,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import type { GetFieldParcelDTO } from "../../interfaces/response/GetFieldParcelDTO";
import FieldParcelPropItem from "./FieldParcelPropItem";
import { useTranslation } from "react-i18next";

interface FieldParcelItemProps {
  parcel: GetFieldParcelDTO;
  selected: boolean;
  index: number;
  onParcelExpand: (index: number) => void;
  onParcelUpdate: (parcel: GetFieldParcelDTO) => void;
  onParcelDelete: (index: string) => void;
}

function FieldParcelItem({
  parcel,
  selected,
  index,
  onParcelExpand,
  onParcelUpdate,
  onParcelDelete,
}: FieldParcelItemProps) {
  const { t } = useTranslation();
  const handleParcelSelect = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    event.stopPropagation();
    onParcelExpand(index);
  };

  const handleParcelUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onParcelUpdate(parcel);
  };

  const handleParcelDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onParcelDelete(parcel.uid);
  };

  return (
    <ListItem
      key={index}
      component={"div"}
      onClick={handleParcelSelect}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",

        "&:hover": {
          "& .MuiListItemButton-root, & .MuiCollapse-root": {
            backgroundColor: "action.hover",
          },
        },
      }}
    >
      <ListItemButton
        disableGutters
        disableRipple
        sx={{
          px: 0.5,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          backgroundColor: selected ? "action.selected" : "transparent",
          transition: "background-color 0.2s ease",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton onClick={handleParcelSelect}>
            {selected ? <KeyboardArrowDownIcon /> : <ChevronRightIcon />}
          </IconButton>
          <ListItemText
            primary={`${t("elements.listItems.fieldParcelItem.name", {
              defaultValue: "Parcel",
            })} ${index + 1}`}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={handleParcelUpdate}>
            <UpdateIcon />
          </IconButton>
          <IconButton onClick={handleParcelDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </ListItemButton>
      <Collapse
        sx={{
          width: "100%",

          backgroundColor: selected ? "action.selected" : "transparent",
          transition: "background-color 0.2s ease, height 0.3s ease-in-out",
        }}
        in={selected}
        timeout={"auto"}
        unmountOnExit
      >
        <List component="div" disablePadding sx={{ pl: 5, pr: 2, pb: 1 }}>
          <FieldParcelPropItem
            propName={t("elements.listItems.fieldParcelItem.layoutType", {
              defaultValue: "Layout Type",
            })}
            propValue={t(`layoutOptions.${parcel.layoutType}`, {
              defaultValue: parcel.layoutType,
            })}
          />

          <FieldParcelPropItem
            propName={t("elements.listItems.fieldParcelItem.cropSpecie", {
              defaultValue: "Crop Specie",
            })}
            propValue={`${t(`elements.forms.addFieldParcelForm.crops.${parcel.specieName}`)} - ${parcel.cultivarName}`}
          />

          <FieldParcelPropItem
            propName={t("elements.listItems.fieldParcelItem.rowsCount", {
              defaultValue: "Number of rows",
            })}
            propValue={`${parcel.layoutParameters.numberOfRows}`}
          />

          <FieldParcelPropItem
            propName={t("elements.listItems.fieldParcelItem.cropsCount", {
              defaultValue: "Number of crops",
            })}
            propValue={`${parcel.layoutParameters.numberOfCrops}`}
          />

          <FieldParcelPropItem
            propName={t("elements.listItems.fieldParcelItem.area", {
              defaultValue: "Area",
            })}
            propValue={`${(parcel.area / 10000).toFixed(2)} ha`}
          />
        </List>
      </Collapse>
      <Divider sx={{ width: "100%" }} />
    </ListItem>
  );
}

export default FieldParcelItem;
