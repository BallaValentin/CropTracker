import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentProfile } from "../hooks/caching/UseCurrentUser";
import type { GetPreviousWorkDTO } from "../interfaces/response/GetPreviousWorkDTO";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  deleteSelectedFieldWorks,
  getFieldWorksByCursor,
} from "../services/FieldWorkService";
import { pageSize } from "../utils/Constants";
import FieldWorkHistoryItem from "../elements/list-item/FieldWorkHistoryItem";
import CropFieldMenu from "../elements/menus/CropFieldMenu";
import WorkTypeMenu from "../elements/menus/WorkTypeMenu";
import { useMutation } from "@tanstack/react-query";
import DeleteFieldWorkDialog from "../elements/dialogs/DeleteFieldWorkDialog";
import { useTranslation } from "react-i18next";
import { useCropFieldNames } from "../hooks/caching/UseCropFieldNames";
import { useWorkTypes } from "../hooks/caching/UseWorkTypes";

function WorkHistoryPage() {
  const { t } = useTranslation();

  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useCurrentProfile();
  const [fieldWorks, setFieldWorks] = useState<GetPreviousWorkDTO[]>([]);
  const navigate = useNavigate();
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [checkedCropFieldIds, setCheckedCropFieldIds] = useState<
    string[] | null
  >(null);
  const [checkedWorkTypeIds, setCheckedWorkTypeIds] = useState<string[] | null>(
    null,
  );

  const [dialogToggled, setDialogToggled] = useState<boolean>(false);

  const cursorRef = useRef<string | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  const { data: workTypes, isLoading: isLoadingWorkTypeNames } = useWorkTypes();

  const { data: cropFields, isLoading: isLoadingCropFieldNames } =
    useCropFieldNames(!!user);

  const handleCropFieldSelect = (cropFieldId: string, checked: boolean) => {
    if (cropFieldId && checkedCropFieldIds) {
      if (checked) {
        if (
          !checkedCropFieldIds?.some((checkedId) => checkedId === cropFieldId)
        ) {
          const updatedCropFieldIds = [...checkedCropFieldIds, cropFieldId];
          console.log("Checked crop field ids updated: ", updatedCropFieldIds);
          setCheckedCropFieldIds([...updatedCropFieldIds]);
        }
      } else {
        if (
          checkedCropFieldIds?.some((checkedId) => checkedId === cropFieldId)
        ) {
          const filteredCheckedCropFieldIds = checkedCropFieldIds.filter(
            (checkedId) => checkedId !== cropFieldId,
          );
          console.log(
            "Checked crop field ids updated: ",
            filteredCheckedCropFieldIds,
          );
          setCheckedCropFieldIds([...filteredCheckedCropFieldIds]);
        }
      }

      cursorRef.current = null;
      setFieldWorks([]);
      setHasMore(true);
    }
  };

  const handleWorkTypeSelect = (workTypeId: string, checked: boolean) => {
    if (workTypeId && checkedWorkTypeIds) {
      if (checked) {
        if (
          !checkedWorkTypeIds?.some((checkedId) => checkedId === workTypeId)
        ) {
          const updatedWorkTypeIds = [...checkedWorkTypeIds, workTypeId];
          setCheckedWorkTypeIds([...updatedWorkTypeIds]);
        }
      } else {
        if (checkedWorkTypeIds?.some((checkedId) => checkedId === workTypeId)) {
          const filteredCheckedWorkTypeIds = checkedWorkTypeIds.filter(
            (checkedId) => checkedId !== workTypeId,
          );
          setCheckedWorkTypeIds([...filteredCheckedWorkTypeIds]);
        }
      }

      cursorRef.current = null;
      setFieldWorks([]);
      setHasMore(true);
    }
  };

  const { mutate: deleteFieldWorksMutate, isPending: isDeletePending } =
    useMutation({
      mutationFn: deleteSelectedFieldWorks,
    });

  const updateFieldWorkChecked = (fieldWorkId: string, isChecked: boolean) => {
    console.log("Field work ID:", fieldWorkId, "Checked:", isChecked);
    setFieldWorks((prev) =>
      prev.map((fieldWork) =>
        fieldWork.uid === fieldWorkId
          ? { ...fieldWork, isChecked: isChecked }
          : fieldWork,
      ),
    );
  };

  const handleFieldWorkDelete = () => {
    const selectedFieldWorks = fieldWorks.filter(
      (fieldWork) => fieldWork.isChecked && fieldWork.isActive,
    );

    deleteFieldWorksMutate(
      selectedFieldWorks.map((fieldWork) => fieldWork.uid),
    );

    setFieldWorks((prev) =>
      prev.map((fieldWork) =>
        fieldWork.isChecked && fieldWork.isActive
          ? { ...fieldWork, isActive: false, isChecked: false }
          : fieldWork,
      ),
    );

    setDialogToggled(false);
  };

  const getNext = (index: number) => {
    while (index < fieldWorks.length && !fieldWorks[index].isActive) {
      index++;
    }

    return index < fieldWorks.length ? fieldWorks[index] : null;
  };

  const getPrevious = (index: number) => {
    while (index >= 0 && !fieldWorks[index].isActive) {
      index--;
    }

    return index >= 0 ? fieldWorks[index] : null;
  };

  const getNextWorks = useCallback(async () => {
    if (!hasMore || isFetchingRef.current || !cropFields || !workTypes) return;

    isFetchingRef.current = true;

    try {
      const response = await getFieldWorksByCursor(
        cursorRef.current,
        checkedCropFieldIds || [],
        checkedWorkTypeIds || [],
        pageSize,
      );
      if (response.length === 0) {
        setHasMore(false);
      } else {
        setFieldWorks((prev) => {
          const updatedWorks = [...prev];
          response.forEach((historyItem) => {
            if (!updatedWorks.some((item) => item.uid === historyItem.uid)) {
              updatedWorks.push({ ...historyItem, isChecked: false });
            }
          });
          return [...updatedWorks];
        });
        cursorRef.current = response[response.length - 1].uid;
      }
    } catch {
      setHasMore(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [hasMore, cropFields, workTypes, checkedCropFieldIds, checkedWorkTypeIds]);

  useEffect(() => {
    if (cursorRef.current === null) {
      getNextWorks();
    }
  }, [getNextWorks, fieldWorks]);

  useEffect(() => {
    if (cropFields) {
      setCheckedCropFieldIds(cropFields.map((cropField) => cropField.uid));
    }
  }, [cropFields]);

  useEffect(() => {
    if (workTypes) {
      setCheckedWorkTypeIds(workTypes.map((workType) => workType.uid));
    }
  }, [workTypes]);

  if (isLoadingUser || isLoadingCropFieldNames || isLoadingWorkTypeNames) {
    return (
      <ProgressCircle
        loadingMessage={t("pages.workHistoryPage.loadingText", {
          defaultValue: "Loading work history...",
        })}
      />
    );
  }

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
          sx={{ fontWeight: "bold", mt: 10 }}
          variant="h3"
        >
          {t("pages.workHistoryPage.pageTitle", {
            defaultValue: "Work History",
          })}
        </Typography>
        <Divider sx={{ mb: 1 }} />

        {fieldWorks.some((fieldWork) => fieldWork.isChecked) ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: 45,
              py: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {fieldWorks.filter((fieldWork) => fieldWork.isChecked).length}{" "}
              {t("pages.workHistoryPage.itemsSelected", {
                defaultValue: "items selected",
              })}
            </Typography>
            <Button color="primary" onClick={() => setDialogToggled(true)}>
              {t("pages.workHistoryPage.deleteButton", {
                defaultValue: "Delete",
              })}
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "block", py: 2, px: 2, height: 45 }} />
        )}

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", gap: 1, width: "100%", mb: 1 }}>
            <Box sx={{ flex: 1 }}>
              <CropFieldMenu
                onCropFieldSelect={handleCropFieldSelect}
                cropFields={cropFields || []}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <WorkTypeMenu
                onWorkTypeSelect={handleWorkTypeSelect}
                workTypes={workTypes || []}
              />
            </Box>
          </Box>

          <Divider sx={{ borderBottomWidth: 3 }} />
        </Box>

        <Box sx={{ height: "70vh", overflow: "auto" }}>
          <InfiniteScroll
            dataLength={fieldWorks.length}
            next={getNextWorks}
            hasMore={hasMore}
            loader={
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <CircularProgress size={30} />
                <Typography
                  variant="caption"
                  fontSize={"medium"}
                  color="text.secondary"
                >
                  {t("pages.workHistoryPage.loadingWorks", {
                    defaultValue: "Loading past works",
                  })}
                </Typography>
              </Box>
            }
            endMessage={
              <Typography
                variant="caption"
                fontSize={"medium"}
                color="text.secondary"
                sx={{ display: "block", mt: 3, textAlign: "center" }}
              >
                {t("pages.workHistoryPage.allWorksLoaded", {
                  defaultValue: "All works are loaded.",
                })}
              </Typography>
            }
          >
            {fieldWorks.map((fieldWork, index) => {
              const nextWork = getNext(index + 1);
              const previousWork = getPrevious(index - 1);

              const isFirstInDate =
                previousWork === null
                  ? true
                  : previousWork.startDate.substring(0, 10) !==
                    fieldWork.startDate.substring(0, 10);
              const isLastInDate =
                nextWork === null
                  ? true
                  : nextWork.startDate.substring(0, 10) !==
                    fieldWork.startDate.substring(0, 10);

              if (!fieldWork.isActive) {
                return null;
              }

              return (
                <Box
                  key={fieldWork.uid}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  {isFirstInDate && (
                    <Paper
                      sx={{
                        bgcolor: "#f4f8f4",
                        px: 1,
                        py: 3,
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                      }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight={"bolder"}
                        sx={{ mb: 1 }}
                      >
                        {fieldWork.startDate.substring(0, 10)}
                      </Typography>
                      <Divider />
                    </Paper>
                  )}
                  <Paper
                    elevation={0}
                    key={fieldWork.uid}
                    sx={{
                      px: 1,
                      py: 0.5,
                      bgcolor: "#f4f8f4",
                      borderBottomLeftRadius: isLastInDate ? 4 : 0,
                      borderBottomRightRadius: isLastInDate ? 4 : 0,
                      mb: isLastInDate ? 3 : 0,
                    }}
                  >
                    <FieldWorkHistoryItem
                      fieldWork={fieldWork}
                      onItemCheck={updateFieldWorkChecked}
                    />
                  </Paper>
                </Box>
              );
            })}
          </InfiniteScroll>
        </Box>
        <DeleteFieldWorkDialog
          isPending={isDeletePending}
          onConfirmDelete={handleFieldWorkDelete}
          onConfirmCancel={() => setDialogToggled(false)}
          open={dialogToggled}
        />
      </MainContainer>
    </Box>
  );
}

export default WorkHistoryPage;
