"use client";

import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from "@mui/x-data-grid";
import { Button, Stack } from "@mui/material";
import { useState } from "react";
import { deleteCategory } from "@/libs/actions/db/listingCategories/listingCategory";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";

export function CustomAdminCategoryDataGrid({
  listingCategory: intitialCategory,
}: {
  listingCategory: { name: string; parent: string | null }[];
}) {
  const [category, setCategory] = useState(
    intitialCategory
      .filter((item) => item.parent !== null)
      .map((item, index) => ({
        ...item,
        id: index + 1,
        subCategory: item.name,
        mainCategory: item.parent,
      }))
  );

  const [selectedCategory, setSelectedCategory] = useState<number[]>([]);
  const router = useRouter();

  const handleDeleteCatClick = (id: GridRowId) => () => {
    setCategory((prev) => prev.filter((row) => row.id !== id));

    const cat = category.find((c) => c.id === id);
    if (cat) {
      deleteCategory({
        mainCategory: cat.mainCategory,
        subCategory: cat.subCategory,
      });
    }
  };

  const handleDeleteCategory = () => {
    console.log("Deleting category:", selectedCategory);

    // Update the state to remove selected categories
    const updatedCategory = category.filter(
      (category) => !selectedCategory.includes(category.id)
    );

    setCategory(updatedCategory);

    // Call the API to delete category
    selectedCategory.forEach((categoryId) => {
      const cat = category.find((c) => c.id === categoryId);
      if (cat) {
        deleteCategory({
          mainCategory: cat.mainCategory,
          subCategory: cat.subCategory,
        });
      }
    });
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "mainCategory", headerName: "Main Category", width: 150 },
    { field: "subCategory", headerName: "Sub Category", width: 150 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteCatClick(id)}
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
          onClick={handleDeleteCategory}
          disabled={selectedCategory.length === 0}
        >
          Delete Selected Category
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => router.push("/admin/manage/categories/createcategory")}
        >
          Create New Category
        </Button>
      </Stack>
      <DataGrid
        rows={category}
        columns={columns}
        getRowId={(row) => row.id}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) =>
          setSelectedCategory(newSelection as number[])
        }
        disableRowSelectionOnClick
      />
    </div>
  );
}
