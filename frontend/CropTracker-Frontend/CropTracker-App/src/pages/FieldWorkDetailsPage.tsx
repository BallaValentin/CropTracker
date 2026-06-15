import { useNavigate, useParams } from "react-router-dom";
import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useFieldWork } from "../hooks/UseFieldWork";
import FieldDetailMapPreview from "../leaflet/FieldDetailMapPreview";
import { useCropField } from "../hooks/UseCropField";
import { useFieldParcels } from "../hooks/UseFieldParcels";
import { Box, Card, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { LatLngObject } from "../interfaces/LatLngObject";
import {
  getGeneratedCrops,
  getGeneratedRectabgles,
  getGeneratedRows,
} from "../utils/GenerateShapesUtil";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FieldInfoContainer from "../elements/containers/FieldInfoContainer";
import type { StringNumber } from "../interfaces/StringNumber";
import { useCurrentProfile } from "../hooks/UseCurrentUser";

function FieldWorkDetailsPage() {
  const [rows, setRows] = useState<LatLngObject[][][] | null>(null);
  const [rowRectangles, setRowRectangles] = useState<LatLngObject[][] | null>(
    null,
  );
  const [cropCoords, setCropCoords] = useState<LatLngObject[] | null>(null);

  const { id } = useParams();
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentProfile();
  const { data: fieldWorkData, isLoading: isFieldWorkLoading } = useFieldWork(
    id || "",
    !!id && !!userData,
  );
  const { data: cropFieldData, isLoading: isCropFieldLoading } = useCropField(
    fieldWorkData?.cropFieldId || "",
    !!id && !!fieldWorkData,
  );
  const { data: fieldParcelsData, isLoading: isFieldParcelsLoading } =
    useFieldParcels(
      fieldWorkData?.cropFieldId || "",
      !!fieldWorkData?.cropFieldId,
    );

  const navigate = useNavigate();

  useEffect(() => {
    if (!fieldParcelsData || !cropFieldData) {
      return;
    }
    const parcelRows = fieldParcelsData.map((parcel) => {
      return getGeneratedRows({
        polygonCoords: parcel.polygonPoints,
        referenceRow: parcel.layoutParameters.referenceRow,
        numberOfRows: parcel.layoutParameters.numberOfRows,
        rowDistance:
          parcel.layoutParameters.bedSpacing +
          parcel.layoutParameters.rowWidth / 2,
      });
    });

    setRows(parcelRows);
  }, [cropFieldData, fieldParcelsData]);

  useEffect(() => {
    if (!fieldParcelsData || !rows || rows.length === 0) {
      return;
    }

    const rectangles = fieldParcelsData
      .map((parcel, index) => {
        return getGeneratedRectabgles({
          rows: rows[index],
          rowWidth: parcel.layoutParameters.rowWidth,
        });
      })
      .flat();
    setRowRectangles(rectangles);
  }, [fieldParcelsData, rows]);

  useEffect(() => {
    if (!fieldParcelsData || !rows || rows.length === 0) {
      return;
    }
    const crops = fieldParcelsData
      .map((parcel, index) => {
        return getGeneratedCrops({
          rows: rows[index],
          rowWidth: parcel.layoutParameters.rowWidth,
          rowMargin: parcel.layoutParameters.marginSpacing,
          rowSpacing: parcel.layoutParameters.rowSpacing,
          cropSpacing: parcel.layoutParameters.plantSpacing,
        });
      })
      .flat();
    setCropCoords(crops);
  }, [fieldParcelsData, rows]);

  if (
    isUserLoading ||
    isFieldWorkLoading ||
    isCropFieldLoading ||
    isFieldParcelsLoading ||
    !fieldWorkData ||
    !cropFieldData ||
    !fieldParcelsData ||
    !rows ||
    !rowRectangles ||
    !cropCoords
  ) {
    return <ProgressCircle loadingMessage="Initializing data..." />;
  }

  const convertDate = (originalDate: string) => {
    return (
      originalDate.substring(0, 10).replace(/-/g, "/") +
      " " +
      originalDate.substring(11, 16)
    );
  };

  const isStringNumber = (element: object | string | number | boolean) => {
    return (
      typeof element === "object" &&
      "textValue" in element &&
      "numberValue" in element
    );
  };

  if (userError) {
    if (userError.response?.status === 401) {
      navigate("/?error=unauthorized");
    }
  }

  return (
    <MainContainer>
      <MainHeader />
      <Card sx={{ minHeight: 800, p: 2, mt: 20 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FieldInfoContainer labelText="Work Type">
            <Typography>{fieldWorkData.workTypeName}</Typography>
          </FieldInfoContainer>
          <Box
            sx={{ display: "flex", gap: 10, justifyContent: "space-between" }}
          >
            {fieldWorkData.startDate && (
              <FieldInfoContainer labelText="Starting Date">
                <Box sx={{ display: "flex", gap: 1 }}>
                  <CalendarMonthIcon />
                  <Typography>
                    {convertDate(fieldWorkData.startDate)}
                  </Typography>
                </Box>
              </FieldInfoContainer>
            )}
            {fieldWorkData.endDate && (
              <FieldInfoContainer labelText="Ending Date">
                <Box sx={{ display: "flex", gap: 1 }}>
                  <CalendarMonthIcon />
                  <Typography>{convertDate(fieldWorkData.endDate)}</Typography>
                </Box>
              </FieldInfoContainer>
            )}
          </Box>

          {Object.entries(fieldWorkData.parameters).map(([key, value]) => {
            if (
              (!Array.isArray(value) && typeof value === "string") ||
              typeof value === "number"
            ) {
              return (
                <FieldInfoContainer labelText={key}>
                  <Typography>{value ? value : "N/A"}</Typography>
                </FieldInfoContainer>
              );
            }

            if (Array.isArray(value)) {
              return (
                <Box sx={{ width: 800 }}>
                  <Typography color="success">{key}</Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Divider />
                    {value.map((element) => {
                      if (isStringNumber(element)) {
                        const snElement = element as StringNumber;
                        return (
                          <Box sx={{ display: "flex", gap: 5 }}>
                            <FieldInfoContainer>
                              <Typography>
                                {snElement.textValue || "N/A"}
                              </Typography>
                            </FieldInfoContainer>
                            <FieldInfoContainer>
                              <Typography>
                                {snElement.numberValue ?? "N/A"}
                              </Typography>
                            </FieldInfoContainer>
                          </Box>
                        );
                      } else {
                        <FieldInfoContainer>
                          <Typography>{element || "N/A"}</Typography>
                        </FieldInfoContainer>;
                      }
                    })}
                    <Divider />
                  </Box>
                </Box>
              );
            }
          })}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: "bold", my: 2 }}>
          Affected parcels
        </Typography>
        <Box sx={{ height: 400, my: 2 }}>
          <FieldDetailMapPreview
            mapHeight={400}
            uid={fieldWorkData.uid}
            markerPosition={cropFieldData.markerPosition}
            polygonPoints={cropFieldData.polygonPoints}
            fieldParcels={fieldParcelsData}
            rows={rows.flat()}
            rowRectangles={rowRectangles}
            cropCoords={cropCoords}
            affectedRows={fieldWorkData.affectedRows}
          />
        </Box>
      </Card>
    </MainContainer>
  );
}

export default FieldWorkDetailsPage;
