import {
  Box,
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
import { getFieldWorksByPage } from "../services/FieldWorkService";
import { pageSize } from "../utils/Constants";
import FieldWorkHistoryItem from "../elements/list-item/FieldWorkHistoryItem";
import CropFieldAutocomplete from "../elements/auto-completes/CropFieldAutocomplete";
import WorkTypeAutocomplete from "../elements/auto-completes/WorkTypeAutocomplete";
import { getCropFieldNames } from "../services/CropFieldService";
import type { GetCropFieldNameDTO } from "../interfaces/response/GetCropFieldNameDTO";
import { useMutation } from "@tanstack/react-query";
import type { GetWorkTypeNameDTO } from "../interfaces/response/GetWorkTypeNameDTO";
import { getWorkTypeNames } from "../services/WorkTypeService";

function WorkHistoryPage() {
  const { isLoading: isLoadingUser, error: userError } = useCurrentProfile();
  const [fieldWorks, setFieldWorks] = useState<GetPreviousWorkDTO[]>([]);
  const navigate = useNavigate();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [cropFieldId, setCropFieldId] = useState<string | null>(null);
  const [workTypeId, setWorkTypeId] = useState<string | null>(null);

  const pageRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);

  const [cropFields, setCropFields] = useState<GetCropFieldNameDTO[]>([]);
  const [workTypes, setWorkTypes] = useState<GetWorkTypeNameDTO[]>([]);

  const { mutate: cropFieldMutate, isPending: isCropFieldPending } =
    useMutation({
      mutationFn: getCropFieldNames,
      onSuccess: (response: GetCropFieldNameDTO[]) => {
        setCropFields(response);
      },
    });

  const handleCropFieldSearch = (searchTerm: string) => {
    cropFieldMutate(searchTerm);
  };

  const handleCropFieldSelect = (cropFieldId: string) => {
    if (cropFieldId) {
      setCropFieldId(cropFieldId);
      pageRef.current = 0;
      setFieldWorks([]);
      setHasMore(true);
    }
  };

  const { mutate: workTypeMutate, isPending: isWorkTypePending } = useMutation({
    mutationFn: getWorkTypeNames,
    onSuccess: (response: GetWorkTypeNameDTO[]) => {
      setWorkTypes(response);
    },
  });

  const handleWorkTypeSearch = (searchTerm: string) => {
    workTypeMutate(searchTerm);
  };
  const handleWorkTypeSelect = (workTypeId: string) => {
    if (workTypeId) {
      setWorkTypeId(workTypeId);
      pageRef.current = 0;
      setFieldWorks([]);
      setHasMore(true);
    }
  };

  const getNextWorks = useCallback(async () => {
    if (!hasMore || isFetchingRef.current) return;

    isFetchingRef.current = true;

    try {
      const response = await getFieldWorksByPage(
        pageRef.current,
        cropFieldId,
        workTypeId,
        pageSize,
      );
      if (response.length === 0) {
        setHasMore(false);
      } else {
        setFieldWorks((prev) => {
          const nextFieldWorks = [...prev];

          response.forEach((historyItem) => {
            if (!nextFieldWorks.some((item) => item.uid === historyItem.uid)) {
              nextFieldWorks.push(historyItem);
            }
          });

          return [...nextFieldWorks];
        });
        pageRef.current += 1;
      }
    } catch {
      setHasMore(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [cropFieldId, hasMore, workTypeId]);

  useEffect(() => {
    if (pageRef.current === 0) {
      getNextWorks();
    }
  }, [getNextWorks, cropFieldId, workTypeId]);

  if (isLoadingUser) {
    return <ProgressCircle loadingMessage="Loading work history..." />;
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
          Work History
        </Typography>
        <Divider sx={{ mb: 10 }} />

        <Box sx={{ display: "flex", gap: 1, width: "100%", mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <CropFieldAutocomplete
              onCropFieldSelect={handleCropFieldSelect}
              onCropFieldSearch={handleCropFieldSearch}
              cropFields={cropFields}
              isPending={isCropFieldPending}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <WorkTypeAutocomplete
              onWorkTypeSelect={handleWorkTypeSelect}
              onWorkTypeSearch={handleWorkTypeSearch}
              workTypes={workTypes}
              isPending={isWorkTypePending}
            />
          </Box>
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
                  Loading past works
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
                All works are loaded.
              </Typography>
            }
          >
            {fieldWorks.map((fieldWork, index) => {
              const isFirstInDate =
                index === 0
                  ? true
                  : fieldWorks[index - 1].startDate.substring(0, 10) !==
                    fieldWork.startDate.substring(0, 10);
              const isLastInDate =
                index === fieldWorks.length - 1
                  ? true
                  : fieldWorks[index + 1].startDate.substring(0, 10) !==
                    fieldWork.startDate.substring(0, 10);
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
                    <FieldWorkHistoryItem fieldWork={fieldWork} />
                  </Paper>
                </Box>
              );
            })}
          </InfiniteScroll>
        </Box>
      </MainContainer>
    </Box>
  );
}

export default WorkHistoryPage;
