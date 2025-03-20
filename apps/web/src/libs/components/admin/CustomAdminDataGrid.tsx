"use client";

import { CustomUser } from "@/libs/types/users";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
} from "@mui/x-data-grid";
import { Button, Stack } from "@mui/material";
import { useState, useMemo } from "react";
import { blockUser } from "@/libs/actions/auth0-management/user";
import { setIsAdmin } from "@/libs/actions/db/users";
import { listings } from "@/libs/db/schema";
import { deleteListing } from "@/libs/actions/db/listings";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
      field: "isAdmin",
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
      valueFormatter: (value) => new Date(value as string).toLocaleString(),
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

export function CustomAdminListingDataGrid({
  listings: intitialListings,
}: {
  listings: (typeof listings.$inferSelect)[];
}) {
  const [listings, setListings] = useState(intitialListings);
  const [selectedListings, setSelectedListings] = useState<number[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleDeleteListings = () => {
    console.log("Deleting listings:", selectedListings);

    // Update the state to remove selected listings
    const updatedListings = listings.filter(
      (listing) => !selectedListings.includes(listing.id)
    );

    setListings(updatedListings);

    // Call the API to delete listings
    selectedListings.forEach((listingId) => {
      deleteListing(listingId);
    });
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setListings(listings.filter((row) => row.id !== id));
    deleteListing(id as number);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    // const editedRow = listings.find((row) => row.id === id);
    // if (editedRow!.id) {
    //   setRows(rows.filter((row) => row.id !== id));
    // }
  };

  const columns: GridColDef<(typeof listings)[number]>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "userUuid", headerName: "Owner" },
    { field: "category", headerName: "Category", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    {
      field: "startingPrice",
      headerName: "Price",
      valueFormatter: (value) => `$${value}`,
    },
    {
      field: "currentPrice",
      headerName: "Current Price",
      valueFormatter: (value) => `$${value}`,
    },
    {
      field: "status",
      headerName: "Status",
      editable: true,
      type: "singleSelect",
      valueOptions: ["ACTIVE", "SOLD"],
    },
    {
      field: "endTime",
      headerName: "End Time",
      width: 150,
      valueFormatter: (value) => new Date(value as string).toLocaleString(),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 150,
      valueFormatter: (value) => new Date(value as string).toLocaleString(),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
              key={`save-${id}`}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
              key={`cancel-${id}`}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
            key={`edit-${id}`}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
            key={`delete-${id}`}
          />,
        ];
      },
    },
  ];

  return (
    <div>
      <Stack direction="row" spacing={2} style={{ marginBottom: "10px" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDeleteListings}
          disabled={selectedListings.length === 0}
        >
          Delete Selected Listings
        </Button>
      </Stack>
      <DataGrid
        rows={listings}
        columns={columns}
        getRowId={(listing) => listing.id}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => {
          setSelectedListings(newSelection as number[]);
        }}
        disableRowSelectionOnClick
      />
    </div>
  );
}
