"use client";

import { CustomUser } from "@/libs/types/user";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export function CustomAdminUserDataGrid({ users }: { users: CustomUser[] }) {
  const columns: GridColDef<(typeof users)[number]>[] = [
    { field: "user_id", headerName: "ID", width: 90 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "is_admin", headerName: "Admin", width: 150, type: "boolean" },
    { field: "created_at", headerName: "Created At", width: 150 },
  ];
  return (
    <DataGrid
      rows={users}
      columns={columns}
      getRowId={(user) => user.user_id}
    />
  );
}
