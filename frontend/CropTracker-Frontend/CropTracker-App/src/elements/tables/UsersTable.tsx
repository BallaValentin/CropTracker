import { Box, Paper } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { AdminUser } from "../../interfaces/AdminUser";

interface UsersTableProps {
  columns: GridColDef[];
  rows: AdminUser[];
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
