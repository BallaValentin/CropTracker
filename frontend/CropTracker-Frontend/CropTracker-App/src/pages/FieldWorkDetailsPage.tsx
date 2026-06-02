import { useParams } from "react-router-dom";
import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useUserProfile } from "../hooks/UseUserProfile";
import { useFieldWork } from "../hooks/UseFieldWork";
import FieldDetailMapPreview from "../leaflet/FieldDetailMapPreview";
import { useCropField } from "../hooks/UseCropField";
import { useFieldParcels } from "../hooks/UseFieldParcels";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import type { LatLngObject } from "../interfaces/LatLngObject";
import {
  getGeneratedCrops,
  getGeneratedRectabgles,
  getGeneratedRows,
} from "../utils/GenerateShapesUtil";

function FieldWorkDetailsPage() {
  const [rows, setRows] = useState<LatLngObject[][][] | null>(null);
  const [rowRectangles, setRowRectangles] = useState<LatLngObject[][] | null>(
    null,
  );
  const [cropCoords, setCropCoords] = useState<LatLngObject[] | null>(null);

  const { id } = useParams();
  const { data: userData, isLoading: isUserLoading } = useUserProfile();
  const { data: fieldWorkData, isLoading: isFieldWorkLoading } = useFieldWork(
    id || "",
    !!id && !!userData,
  );
  const { data: cropFieldData, isLoading: isCropFieldLoading } = useCropField(
    fieldWorkData?.cropFieldId || "",
    !!id && !!fieldWorkData,
  );
  const { data: fieldParcelsData, isLoading: isFieldParcelsLoading } =
    useFieldParcels(fieldWorkData?.cropFieldId || "");

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

  console.log("Affected rows in details page: ", fieldWorkData.affectedRows);

  return (
    <MainContainer hasDrawer={userData != null}>
      <MainHeader userData={userData} />
      <Box sx={{ height: 500 }}>
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
    </MainContainer>
  );
}

export default FieldWorkDetailsPage;
