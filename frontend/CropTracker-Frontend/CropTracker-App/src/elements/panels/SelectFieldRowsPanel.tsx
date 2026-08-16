import {
  Box,
  Button,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
} from "@mui/material";
import SelectRowsView from "../../leaflet/view/SelectRowsView";
import type { GetCropFieldDTO } from "../../interfaces/response/GetCropFieldDTO";
import type { GetFieldParcelDTO } from "../../interfaces/response/GetFieldParcelDTO";
import { useEffect, useState } from "react";
import SelectAffectedRowsDialog from "../dialogs/SelectAffectedRowsDialog";
import type { GetWorkTypeDTO } from "../../interfaces/response/GetWorkTypeDTO";
import type { GetPreviousWorkDTO } from "../../interfaces/response/GetPreviousWorkDTO";
import SelectWorksDialog from "../dialogs/SelectWorksDialog";
import { useTranslation } from "react-i18next";

interface SelectFieldRowsPanelProps {
  isPending: boolean;
  cropField: GetCropFieldDTO;
  fieldParcels: GetFieldParcelDTO[];
  affectedRows: boolean[];
  previousWorks: GetPreviousWorkDTO[];
  workTypes: GetWorkTypeDTO[];
  onParcelSelect: (index: number, checked: boolean) => void;
  onRowsSearch: (rows: number, selectedWorkTypes: string[]) => void;
  onRowClick: (index: number) => void;
}

function SelectFieldRowsPanel({
  isPending,
  cropField,
  fieldParcels,
  affectedRows,
  onParcelSelect,
  workTypes,
  previousWorks,
  onRowsSearch,
  onRowClick,
}: SelectFieldRowsPanelProps) {
  const { t } = useTranslation();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);
  const [checkedWorkTypes, setCheckedWorkTypes] = useState<boolean[]>(
    Array(workTypes.length).fill(false),
  );
  const [showResults, setShowResults] = useState<boolean>(false);
  const [previousRows, setPreviousRows] = useState<boolean[]>(
    Array(affectedRows.length).fill(false),
  );
  const [checkedFieldWorks, setCheckedFieldWorks] = useState<boolean[]>(
    Array(previousWorks.length).fill(false),
  );

  useEffect(() => {
    if (workTypes) {
      setCheckedWorkTypes(Array(workTypes.length).fill(false));
    }
  }, [workTypes, affectedRows]);

  useEffect(() => {
    if (previousWorks && previousWorks.length > 0) {
      setCheckedFieldWorks(Array(previousWorks.length).fill(false));
      setPreviousRows(Array(affectedRows.length).fill(false));
    }
  }, [affectedRows.length, previousWorks]);

  const updateCheckedWorks = (updatedPreviousWorks: boolean[]) => {
    setCheckedFieldWorks(updatedPreviousWorks);
  };

  useEffect(() => {
    if (previousWorks && previousWorks.length > 0) {
      const updatedPreviousRows = Array(affectedRows.length).fill(false);
      previousWorks.forEach((previousWork, index) => {
        console.log("checkedFieldWorks[index]", checkedFieldWorks[index]);
        if (checkedFieldWorks[index]) {
          for (let j = 0; j < updatedPreviousRows.length; j++) {
            updatedPreviousRows[j] =
              updatedPreviousRows[j] || previousWork.affectedRows[j];
          }
        }
      });
      setPreviousRows(updatedPreviousRows);
    }
  }, [affectedRows.length, checkedFieldWorks, previousWorks]);

  const handleParcelSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    event.stopPropagation();
    const checked = event.target.checked;
    onParcelSelect(index, checked);
  };

  const handleShowPrevWorks = () => {
    setDialogOpen(true);
  };

  const handleSelect = (days: number) => {
    const selectedWorkTypes = workTypes
      .filter((_, index) => checkedWorkTypes[index])
      .map((workType) => workType.uid);
    onRowsSearch(days, selectedWorkTypes);
    setShowResults(true);
  };

  const handleGoBack = () => {
    console.log("BACK");
    setShowResults(false);
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleWorkTypeCheck = (updatedCheckedWorkTypes: boolean[]) => {
    setCheckedWorkTypes(updatedCheckedWorkTypes);
  };

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHidden(event.target.checked);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        mt: 2,
        height: 800,
        width: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <Typography
        variant="h6"
        sx={{ p: 2, fontWeight: "bold", letterSpacing: "0.05rem" }}
      >
        {t("elements.panels.selectFieldRowsPanel.panelTitle") ||
          "Select field parcels for work"}
      </Typography>
      <Box sx={{ display: "flex", height: "100%" }}>
        <Box sx={{ flex: 1, p: 2 }}>
          <SelectRowsView
            polygonPoints={cropField.polygonPoints}
            markerPosition={cropField.markerPosition}
            uid={""}
            mapHeight={700}
            fieldParcels={fieldParcels}
            affectedRows={affectedRows}
            onRowClick={onRowClick}
            previousRows={previousRows}
            previousHidden={hidden}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 700,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              margin: "auto",
              flexDirection: "column",
              maxWidth: 320,
              gap: 1,
            }}
          >
            <List
              subheader={
                <ListSubheader sx={{ fontWeight: "bold", lineHeight: "40px" }}>
                  {t("elements.panels.selectFieldRowsPanel.panelText") ||
                    "Select the parcels to work on"}
                </ListSubheader>
              }
            >
              <Divider />
              {fieldParcels.map((parcel, index) => (
                <ListItem key={parcel.uid}>
                  <ListItemButton
                    sx={{
                      minWidth: 320,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <ListItemText primary={`Parcel ${index + 1}`} />
                    <Checkbox onChange={(e) => handleParcelSelect(e, index)} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Button onClick={handleShowPrevWorks} color="success">
              {t("elements.panels.selectFieldRowsPanel.showPreviousWorks") ||
                "Show affected rows from previous works"}
            </Button>
          </Box>

          <Box sx={{ mt: "auto", display: "flex", justifyContent: "flex-end" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>
                {t("elements.panels.selectFieldRowsPanel.hideRowsCheckbox") ||
                  "Hide previous affected rows"}
              </Typography>
              <Checkbox onChange={handleCheck} />
            </Box>
          </Box>
        </Box>
      </Box>
      {dialogOpen && !showResults && (
        <SelectAffectedRowsDialog
          onConfirmSelect={handleSelect}
          onConfirmCancel={handleCancel}
          workTypes={workTypes}
          open={dialogOpen}
          checkedWorkTypes={checkedWorkTypes}
          onSelectWorkType={handleWorkTypeCheck}
          isPending={isPending}
        />
      )}

      {dialogOpen && showResults && (
        <SelectWorksDialog
          onBack={handleGoBack}
          onConfirmCancel={handleCancel}
          fieldWorks={previousWorks}
          open={dialogOpen}
          checkedFieldWorks={checkedFieldWorks}
          onCheckFieldWork={updateCheckedWorks}
        />
      )}
    </Paper>
  );
}

export default SelectFieldRowsPanel;
