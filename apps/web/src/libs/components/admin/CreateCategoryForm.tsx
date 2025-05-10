"use client";

import { useState } from "react";
import { Alert, Button, TextField, Stack, MenuItem } from "@mui/material";
import { createCategory } from "@/libs/actions/db/listingCategories/listingCategory";

export function CreateCategoryForm({
  listingCategory,
}: {
  listingCategory: { name: string }[];
}) {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  return (
    <form
      action={async (formData) => {
        const result = await createCategory(formData);
        setMessage(result.message);
        setIsError(!result.success);
      }}
    >
      <Stack spacing={2} maxWidth={500}>
        {message && (
          <Alert severity={isError ? "error" : "success"}>{message}</Alert>
        )}

        <TextField select label="Main Category" name="mainCategory" required>
          {listingCategory.map((cat) => (
            <MenuItem key={cat.name} value={cat.name}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField label="Sub Category" name="subCategory" required />

        <Button type="submit" variant="contained" color="primary">
          Create category
        </Button>
      </Stack>
    </form>
  );
}
