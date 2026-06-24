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

function WorkHistoryPage() {
  const { isLoading: isLoadingUser, error: userError } = useCurrentProfile();
  const [fieldWorks, setFieldWorks] = useState<GetPreviousWorkDTO[]>([]);
  const navigate = useNavigate();
  const [hasMore, setHasMore] = useState<boolean>(true);

  const pageRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);

  const getNextWorks = useCallback(async () => {
    if (!hasMore || isFetchingRef.current) return;

    isFetchingRef.current = true;

    try {
      const response = await getFieldWorksByPage(pageRef.current, pageSize);
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
  }, [hasMore, isFetchingRef]);

  useEffect(() => {
    if (pageRef.current === 0) {
      getNextWorks();
    }
  }, [getNextWorks]);

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
                        borderTopLeftRadius: 2,
                        borderTopRightRadius: 2,
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
                      borderBottomLeftRadius: isLastInDate ? 2 : 0,
                      borderBottomRightRadius: isLastInDate ? 2 : 0,
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
