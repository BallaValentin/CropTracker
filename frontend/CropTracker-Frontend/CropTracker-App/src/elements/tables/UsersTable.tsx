import { Box, Paper } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { GetAdminUserDTO } from "../../interfaces/response/GetAdminUserDTO";

interface UsersTableProps {
  columns: GridColDef[];
  rows: GetAdminUserDTO[];
  isLoading: boolean;
}

function UsersTable({ columns, rows, isLoading }: UsersTableProps) {
  const paginationModel = { page: 0, pageSize: 15 };

  if (isLoading) {
    return null;
  }

  return (
    <Box>
      <Paper
        sx={{
          height: 400,
        }}
      >
        <DataGrid
          columns={columns}
          rows={rows}
          loading={isLoading}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 15, 20]}
          checkboxSelection
          sx={{
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            },
          }}
        />
      </Paper>
    </Box>
  );
}

export default UsersTable;
