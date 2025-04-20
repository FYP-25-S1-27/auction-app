"use client";

import { Box, Button, Chip, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ProfileLayout from "@/libs/components/profileLayout";
import { InferSelectModel } from "drizzle-orm";
import { listingCategory } from "@/libs/db/schema";

type CategoriesSchema = InferSelectModel<typeof listingCategory>;

function buildCategoryHierarchy(categories: CategoriesSchema[]) {
  // Find all root categories (with null parent)
  const rootCategories = categories.filter((cat) => cat.parent === null);

  // Create the hierarchy
  return rootCategories.map((parent) => ({
    ...parent,
    children: categories.filter((cat) => cat.parent === parent.name),
  }));
}

export default function InterestsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categoryHierarchy, setCategoryHierarchy] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data: CategoriesSchema[] = await response.json();
          console.log("Raw data:", data);
          const hierarchical = buildCategoryHierarchy(data);
          console.log("Hierarchical:", hierarchical);
          setCategoryHierarchy(hierarchical);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleToggle = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = () => {
    const data = {
      interests: selected,
    };
    console.log("Saved Interests:", data);
    // TODO: Replace with API call to save
  };

  const handleCancel = () => {
    setSelected([]);
  };

  return (
    <Box
      sx={{ padding: "24px", minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <ProfileLayout>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Customize your item recommendations based on your interests
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* Categories */}
        {categoryHierarchy.map((category) => (
          <Box key={category.name} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {category.name}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {/* Use keyof to ensure category is a valid key of interestsByCategory */}
              {/* {interestsByCategory[category as keyof typeof interestsByCategory]?.map((interest) => (
              <Chip
                key={interest}
                label={interest}
                variant={selected.includes(interest) ? "filled" : "outlined"}
                color={selected.includes(interest) ? "success" : "default"}
                onClick={() => handleToggle(interest)}
                clickable
              />
            ))} */}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {category.children.map((childCategory: any) => (
                <Chip
                  key={childCategory.name}
                  label={childCategory.name}
                  variant={
                    selected.includes(childCategory.name)
                      ? "filled"
                      : "outlined"
                  }
                  color={
                    selected.includes(childCategory.name)
                      ? "success"
                      : "default"
                  }
                  onClick={() => handleToggle(childCategory.name)}
                  clickable
                />
              ))}
            </Box>
          </Box>
        ))}

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </ProfileLayout>
    </Box>
  );
}
