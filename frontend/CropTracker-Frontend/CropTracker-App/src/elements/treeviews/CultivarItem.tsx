import { TreeItem } from "@mui/x-tree-view";
import type { GetCropCultivarDTO } from "../../interfaces/response/GetCropCultivarDTO";

function CultivarItem(cultivar: GetCropCultivarDTO) {
  return <TreeItem itemId={cultivar.uid} label={cultivar.cultivarName} />;
}

export default CultivarItem;
