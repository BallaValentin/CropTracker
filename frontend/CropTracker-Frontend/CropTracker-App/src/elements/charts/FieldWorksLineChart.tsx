import type { GetFieldWorkDTO } from "../../interfaces/response/GetFieldWorkDTO";

interface FieldWorkLineChartProps {
  fieldWorks: GetFieldWorkDTO[];
}

function FieldWorkLineChart({ fieldWorks }: FieldWorkLineChartProps) {}

export default FieldWorkLineChart;
