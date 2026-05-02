import MainContainer from "../elements/containers/MainContainer";
import MainHeader from "../elements/headers/MainHeader";
import ProgressCircle from "../elements/progress/ProgressCircle";
import { useUserProfile } from "../hooks/UseUserProfile";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPlotById, updatePlot } from "../services/PlotService";
import UpdatePlotForm from "../elements/forms/UpdatePlotForm";
import type { Plot } from "../interfaces/Plot";
import { useEffect, useState } from "react";
import type { UpdatePlot } from "../interfaces/request/UpdatePlot";
import { queryClient } from "../query-client/QueryClient";

function UpdatePlotPage() {
  const { data: user, isLoading: isLoadingUser, error } = useUserProfile();
  const [plotDetail, setPlotDetail] = useState<Plot>({
    uid: "",
    name: "Unnamed Field",
    markerPosition: {
      lat: 51.505,
      lng: -0.09,
    },
    polygonPoints: [],
    area: 0,
  });

  const { id } = useParams();
  const navigate = useNavigate();
  let authenticated = true;

  const {
    data: plot,
    isLoading: isPlotLoading,
    //error: plotError,
  } = useQuery({
    queryKey: ["plots", id],
    queryFn: () => getPlotById(id || ""),
    staleTime: 1000 * 60 * 60,
    enabled: !!id,
    refetchInterval: 1000 * 60 * 60,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (plot) {
      setPlotDetail(plot);
    }
  }, [plot]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      plotUpdateData,
      id,
    }: {
      plotUpdateData: UpdatePlot;
      id: string;
    }) => updatePlot(plotUpdateData, id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plots", id] });
      navigate(`/plot-details/${id}`);
    },
  });

  const handleOnUpdate = (plotUpdateData: UpdatePlot) => {
    mutate({ plotUpdateData, id: id || "" });
  };

  if (isLoadingUser) {
    return <ProgressCircle loadingMessage="Loading user data" />;
  }

  if (isPlotLoading) {
    return <ProgressCircle loadingMessage="Loading field details" />;
  }

  if (error) {
    authenticated = false;
  }

  console.log("Plot details:", plotDetail);

  return (
    <>
      <MainHeader userData={user} authenticated={authenticated} />
      <MainContainer hasDrawer={authenticated}>
        <UpdatePlotForm
          plot={plotDetail}
          onUpdate={handleOnUpdate}
          isPending={isPending}
        />
      </MainContainer>
    </>
  );
}

export default UpdatePlotPage;
