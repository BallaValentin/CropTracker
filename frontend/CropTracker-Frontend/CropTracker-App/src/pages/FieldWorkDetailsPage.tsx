import { useNavigate, useParams } from "react-router-dom";
import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useFieldWork } from "../hooks/caching/UseFieldWork";
import FieldDetailMapPreview from "../leaflet/view/FieldDetailMapPreview";
import { Box, Card, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { LatLngObject } from "../interfaces/helper/LatLngObject";
import {
  getGeneratedCrops,
  getGeneratedRectabgles,
  getGeneratedRows,
} from "../utils/GenerateShapesUtil";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FieldInfoContainer from "../elements/containers/FieldInfoContainer";
import type { StringNumber } from "../interfaces/helper/StringNumber";
import { useCurrentProfile } from "../hooks/caching/UseCurrentUser";
import { useFieldWorkCropField } from "../hooks/caching/UseFieldWorkCropField";
import { useCropFieldVersionParcels } from "../hooks/caching/UseCropFieldVersionParcels";
import { useTranslation } from "react-i18next";
import { useWorkTypeByID } from "../hooks/caching/UseWorkTypeByID";

function FieldWorkDetailsPage() {
  const { t } = useTranslation();

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
  const { data: cropFieldData, isLoading: isCropFieldLoading } =
    useFieldWorkCropField(id || "", !!id);
  const { data: fieldParcelsData, isLoading: isFieldParcelsLoading } =
    useCropFieldVersionParcels(
      fieldWorkData?.cropFieldId || "",
      !!fieldWorkData?.cropFieldId,
    );
  const { data: workType, isLoading: isWorkTypeLoading } = useWorkTypeByID(
    fieldWorkData?.workTypeId || "",
    !!fieldWorkData?.workTypeId,
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
          parcel.layoutParameters.bedSpacing + parcel.layoutParameters.rowWidth,
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

  useEffect(() => {
    if (workType) {
      console.log("Work type received: ", workType);
    }
  });

  if (
    isUserLoading ||
    isFieldWorkLoading ||
    isCropFieldLoading ||
    isFieldParcelsLoading ||
    isWorkTypeLoading ||
    !fieldWorkData ||
    !cropFieldData ||
    !fieldParcelsData ||
    !workType ||
    !rows ||
    !rowRectangles ||
    !cropCoords
  ) {
    return (
      <ProgressCircle
        loadingMessage={t("pages.fieldWorkDetailsPage.loadingMessage", {
          defaultValue: "Loading field work data...",
        })}
      />
    );
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
    <Box>
      <MainHeader />
      <MainContainer>
        <Typography
          component={"h1"}
          color="success"
          letterSpacing={"0.02em"}
          sx={{ fontWeight: "bold", my: 10 }}
          variant="h3"
        >
          {cropFieldData.name}
        </Typography>
        <Card sx={{ minHeight: 800, p: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FieldInfoContainer
              labelText={t("pages.fieldWorkDetailsPage.workTypeLabel", {
                defaultValue: "Work Type",
              })}
            >
              <Typography>
                {t(
                  `elements.forms.addFieldWorkForm.systemWorkTypes.${fieldWorkData.workTypeName}.name`,
                  {
                    defaultValue: fieldWorkData.workTypeName,
                  },
                )}
              </Typography>
            </FieldInfoContainer>
            <Box
              sx={{ display: "flex", gap: 10, justifyContent: "space-between" }}
            >
              {fieldWorkData.startDate && (
                <FieldInfoContainer
                  labelText={t("pages.fieldWorkDetailsPage.startDateLabel", {
                    defaultValue: "Starting Date",
                  })}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <CalendarMonthIcon />
                    <Typography>
                      {convertDate(fieldWorkData.startDate)}
                    </Typography>
                  </Box>
                </FieldInfoContainer>
              )}
              {fieldWorkData.endDate && (
                <FieldInfoContainer
                  labelText={t("pages.fieldWorkDetailsPage.endDateLabel", {
                    defaultValue: "Ending Date",
                  })}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <CalendarMonthIcon />
                    <Typography>
                      {convertDate(fieldWorkData.endDate)}
                    </Typography>
                  </Box>
                </FieldInfoContainer>
              )}
            </Box>

            {Object.entries(fieldWorkData.parameters).map(
              ([key, value], paramIndex) => {
                if (
                  typeof value === "object" &&
                  "numericValue" in value &&
                  "optionIndex" in value
                ) {
                  return (
                    <FieldInfoContainer
                      labelText={t(
                        `elements.forms.addFieldWorkForm.systemWorkTypes.${fieldWorkData.workTypeName}.fields.${key}.name`,
                        {
                          defaultValue: key,
                        },
                      )}
                    >
                      {`${value["numericValue"]} ${workType.fieldDefinitions[paramIndex].options[value.optionIndex].optionName}`}
                    </FieldInfoContainer>
                  );
                }
                if (!Array.isArray(value) && typeof value === "string") {
                  return (
                    <FieldInfoContainer
                      labelText={t(
                        `elements.forms.addFieldWorkForm.systemWorkTypes.${fieldWorkData.workTypeName}.fields.${key}.name`,
                        {
                          defaultValue: key,
                        },
                      )}
                    >
                      <Typography>
                        {value
                          ? t(
                              `elements.forms.addFieldWorkForm.systemWorkTypes.${fieldWorkData.workTypeName}.fields.${key}.options.${value}`,
                              {
                                defaultValue: value,
                              },
                            )
                          : "N/A"}
                      </Typography>
                    </FieldInfoContainer>
                  );
                }

                if (Array.isArray(value)) {
                  return (
                    <Box sx={{ width: 800 }}>
                      <Typography color="success">{key}</Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
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
              },
            )}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", my: 2 }}>
            {t("pages.fieldWorkDetailsPage.parcelsAffected", {
              defaultValue: "Affected parcels",
            })}
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
              parcelsSelected={[]}
            />
          </Box>
        </Card>
      </MainContainer>
    </Box>
  );
}

export default FieldWorkDetailsPage;
