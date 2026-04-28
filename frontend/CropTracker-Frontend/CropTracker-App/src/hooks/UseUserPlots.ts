import { useQuery } from "@tanstack/react-query";
import type { Plot } from "../interfaces/Plot"
import { getPlots } from "../services/PlotService"
import type { AxiosError } from "axios";

export const useUserPlots = () => {
    const query = useQuery<Plot[], AxiosError>({
        queryKey: ["plots"],
        queryFn: getPlots,
        staleTime: 1000 * 60 * 60,
        refetchInterval: 1000 * 60 * 60,
    })

    return query;
}