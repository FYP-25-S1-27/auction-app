"use client";

import { Alert, Box, Button, Chip, Divider, Typography, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import ProfileLayout from "@/libs/components/profileLayout";
import { InferSelectModel } from "drizzle-orm";
import { listingCategory } from "@/libs/db/schema";
import { useUser } from "@auth0/nextjs-auth0";

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
  const [showSuccess, setShowSuccess] = useState(false);
  const auth = useUser();

  useEffect(() => {
    if (!auth.user) return;
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

    const fetchUserInterests = async () => {
      try {
      
        const response = await fetch(
          `/api/userinterests?userUuid=${auth.user.sub}`
        );
        if (response.ok) {
          const data: string[] = await response.json();
          setSelected(data);
        } else {
          console.error("Failed to fetch user interests");
        }
      } catch (error) {
        console.error("Error fetching user interests:", error);
      }
    };

    fetchCategories();
    fetchUserInterests();
  }, [auth.user]);

  const handleToggle = async (interest: string) => {
    if (!auth.user) return;
    if (selected.includes(interest)) {
      // Remove interest
      setSelected((prev) => prev.filter((i) => i !== interest));
      try {
        const response = await fetch(
          `/api/userinterests?userUuid=${auth.user.sub}&interest=${interest}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          console.error("Failed to delete interest");
        }
      } catch (error) {
        console.error("Error deleting interest:", error);
      }
    } else {
      // Add interest
      setSelected((prev) => [...prev, interest]);
      try {
        const response = await fetch("/api/userinterests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userUuid: auth.user.sub,
            interests: [interest],
          }),
        });
        if (!response.ok) {
          console.error("Failed to add interest");
        }
      } catch (error) {
        console.error("Error adding interest:", error);
      }
    }
  };

  const handleSave = async () => {
    if (!auth.user) return;
    const data = {
      userUuid: auth.user.sub,
      interests: selected,
    };
    try {
      const response = await fetch("/api/userinterests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log("Response status:", response.status);
      console.log("Response body:", await response.json());

      if (response.ok) {
        console.log("Interests saved successfully");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        console.error("Failed to save interests");
      }
    } catch (error) {
      console.error("Error saving interests:", error);
    }
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

        <Snackbar
            open={showSuccess}
            autoHideDuration={5000}
            onClose={() => setShowSuccess(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setShowSuccess(false)}
              severity="success"
              sx={{ width: "100%" }}
            >
              Interests saved successfully!
            </Alert>
          </Snackbar>

        {/* Categories */}
        {categoryHierarchy.map((category) => (
          <Box key={category.name} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {category.name}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
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
          <Button variant="contained" color="success" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </ProfileLayout>
    </Box>
  );
}