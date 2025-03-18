"use client";

import { CustomUser } from "@/libs/types/user";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Stack } from "@mui/material";
import { useState, useMemo } from "react";
import { blockUser } from "@/libs/actions/auth0-management/user";
import { setIsAdmin } from "@/libs/actions/db/user";

export function CustomAdminUserDataGrid({
  users: initialUsers,
}: {
  users: CustomUser[];
}) {
  const [users, setUsers] = useState<CustomUser[]>(initialUsers); // Manage users as state
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Determine if all selected users are blocked
  const allSelectedBlocked = useMemo(() => {
    return selectedUsers.every(
      (user_id) => users.find((user) => user.user_id === user_id)?.blocked
    );
  }, [selectedUsers, users]);

  // Determine if all selected users are admins
  const allSelectedAdmins = useMemo(() => {
    return selectedUsers.every(
      (user_id) => users.find((user) => user.user_id === user_id)?.is_admin
    );
  }, [selectedUsers, users]);

  const handleToggleBlockUsers = () => {
    console.log(
      `${allSelectedBlocked ? "Unblocking" : "Blocking"} users:`,
      selectedUsers
    );

    // Update the `blocked` state for selected users
    const updatedUsers = users.map((user) =>
      selectedUsers.includes(user.user_id)
        ? { ...user, blocked: !allSelectedBlocked }
        : user
    );

    setUsers(updatedUsers);

    // Call the API to block/unblock users
    selectedUsers.forEach((user_id) => {
      blockUser(user_id, !allSelectedBlocked);
    });
  };

  const handleToggleAdminUsers = () => {
    console.log(
      `${
        allSelectedAdmins ? "Revoking admin" : "Granting admin"
      } rights for users:`,
      selectedUsers
    );

    // Update the `is_admin` state for selected users
    const updatedUsers = users.map((user) =>
      selectedUsers.includes(user.user_id)
        ? { ...user, is_admin: !allSelectedAdmins }
        : user
    );

    setUsers(updatedUsers);

    // Call the API to toggle admin rights
    selectedUsers.forEach((user_id) => {
      setIsAdmin(user_id, !allSelectedAdmins);
    });
  };

  const columns: GridColDef<(typeof users)[number]>[] = [
    { field: "user_id", headerName: "ID", width: 90 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "username", headerName: "Username", width: 150 },
    {
      field: "is_admin",
      headerName: "Admin",
      type: "boolean",
    },
    {
      field: "blocked",
      headerName: "Blocked",
      type: "boolean",
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 150,
      valueFormatter: (params) => new Date(params as string).toLocaleString(),
    },
  ];

  return (
    <div>
      <Stack direction="row" spacing={2} style={{ marginBottom: "10px" }}>
        <Button
          variant="contained"
          color={allSelectedBlocked ? "primary" : "secondary"}
          onClick={handleToggleBlockUsers}
          disabled={selectedUsers.length === 0}
        >
          {allSelectedBlocked ? "Unblock" : "Block"} Selected Users
        </Button>
        <Button
          variant="contained"
          color={allSelectedAdmins ? "primary" : "secondary"}
          onClick={handleToggleAdminUsers}
          disabled={selectedUsers.length === 0}
        >
          {allSelectedAdmins ? "Revoke Admin" : "Grant Admin"} Rights
        </Button>
      </Stack>
      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(user) => user.user_id}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => {
          setSelectedUsers(newSelection as string[]);
        }}
        disableRowSelectionOnClick
      />
    </div>
  );
}
