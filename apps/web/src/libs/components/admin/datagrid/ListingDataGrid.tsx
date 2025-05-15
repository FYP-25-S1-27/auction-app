"use client";

import {
  DataGrid,
  // GridActionsCellItem,
  GridColDef,
  // GridRowId,
  // GridRowModes,
  // GridRowModesModel,
} from "@mui/x-data-grid";
import { Button, Stack } from "@mui/material";
import { useState } from "react";
import { listings } from "@/libs/db/schema";
import { suspendListing } from "@/libs/actions/db/listings/listings";
// import SaveIcon from "@mui/icons-material/Save";
// import CancelIcon from "@mui/icons-material/Cancel";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";

export function CustomAdminListingDataGrid({
  listings: intitialListings,
}: {
  listings: (typeof listings.$inferSelect)[];
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [listings, setListings] = useState(intitialListings);
  const [selectedListings, setSelectedListings] = useState<number[]>([]);
  // const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleSuspendListings = (isSuspending: boolean) => {
    // console.log("Deleting listings:", selectedListings);

    // Update the state to selected listings
    const updatedListings = listings.map((listing) => {
      if (selectedListings.includes(listing.id)) {
        return { ...listing, status: isSuspending ? "SUSPENDED" : "ACTIVE" };
      }
      return listing;
    });

    setListings(updatedListings);

    // Call the API to delete listings
    selectedListings.forEach((listingId) => {
      suspendListing(listingId, isSuspending);
    });
  };

  // const handleEditClick = (id: GridRowId) => () => {
  //   setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  // };

  // const handleSaveClick = (id: GridRowId) => () => {
  //   setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  // };

  // const handleDeleteClick = (id: GridRowId) => () => {
  //   setListings(listings.filter((row) => row.id !== id));
  //   suspendListing(id as number);
  // };

  // const handleCancelClick = (id: GridRowId) => () => {
  //   setRowModesModel({
  //     ...rowModesModel,
  //     [id]: { mode: GridRowModes.View, ignoreModifications: true },
  //   });

  // const editedRow = listings.find((row) => row.id === id);
  // if (editedRow!.id) {
  //   setRows(rows.filter((row) => row.id !== id));
  // }
  // };

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
    // {
    //   field: "actions",
    //   type: "actions",
    //   headerName: "Actions",
    //   width: 100,
    //   cellClassName: "actions",
    //   getActions: ({ id }) => {
    //     const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

    //     if (isInEditMode) {
    //       return [
    //         <GridActionsCellItem
    //           icon={<SaveIcon />}
    //           label="Save"
    //           sx={{
    //             color: "primary.main",
    //           }}
    //           onClick={handleSaveClick(id)}
    //           key={`save-${id}`}
    //         />,
    //         <GridActionsCellItem
    //           icon={<CancelIcon />}
    //           label="Cancel"
    //           className="textPrimary"
    //           onClick={handleCancelClick(id)}
    //           color="inherit"
    //           key={`cancel-${id}`}
    //         />,
    //       ];
    //     }

    //     return [
    //       <GridActionsCellItem
    //         icon={<EditIcon />}
    //         label="Edit"
    //         className="textPrimary"
    //         onClick={handleEditClick(id)}
    //         color="inherit"
    //         key={`edit-${id}`}
    //       />,
    //       <GridActionsCellItem
    //         icon={<DeleteIcon />}
    //         label="Delete"
    //         onClick={handleDeleteClick(id)}
    //         color="inherit"
    //         key={`delete-${id}`}
    //       />,
    //     ];
    //   },
    // },
  ];

  return (
    <div>
      <Stack direction="row" spacing={2} style={{ marginBottom: "10px" }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleSuspendListings(true)}
          disabled={selectedListings.length === 0}
        >
          Suspend Selected Listings
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSuspendListings(false)}
          disabled={selectedListings.length === 0}
        >
          Unsuspend Selected Listings
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
