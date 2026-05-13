import { TreeItem } from "@mui/x-tree-view";
import { useCropsStore } from "../../hooks/UseCropsStore";
import type { GetCropSpecieDTO } from "../../interfaces/response/GetCropSpecieDTO";
import { CircularProgress } from "@mui/material";
import CultivarItem from "./CultivarItem";
import type { GetCropCultivarDTO } from "../../interfaces/response/GetCropCultivarDTO";

function SpecieItem(specie: GetCropSpecieDTO) {
  const emptyCultivarsList = [] as GetCropCultivarDTO[];
  const cultivars = useCropsStore(
    (s) => s.cultivars[specie.uid] || emptyCultivarsList,
  );
  const loading = useCropsStore((s) => s.loading[specie.uid]);
  const fetchCultivars = useCropsStore((s) => s.fetchCultivars);

  return (
    <TreeItem
      itemId={specie.uid}
      label={specie.commonName}
      onClick={() => fetchCultivars}
    >
      {loading ? (
        <TreeItem
          itemId={`${specie.uid}-load`}
          label={<CircularProgress size={16} />}
        />
      ) : (
        cultivars.map((cultivar) => (
          <CultivarItem key={cultivar.uid} {...cultivar} />
        ))
      )}
    </TreeItem>
  );
}

export default SpecieItem;
