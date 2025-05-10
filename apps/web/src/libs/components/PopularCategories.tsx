"use server";
import React from "react";
import { Box, Grid, Typography, Container, Paper, Stack } from "@mui/material";
import getPopularCategories from "../actions/db/listingCategories/popular";
import { connection } from "next/server";
import NextLink from "next/link";

const _categories = await getPopularCategories(); // function returns a limit of 4 categories

// add appropriate bg color to each category
const categories = _categories.map((category, index) => ({
  ...category,
  color: ["#8B0000", "#8B5A2B", "#DAA520", "#008000", "#006B6B", "#1E3A5F"][
    index % 6
  ],
}));

export default async function PopularCategories() {
  await connection();
  return (
    <Box sx={{ py: 5 }}>
      <Container>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
          Popular Categories
        </Typography>
        <Grid container spacing={2}>
          {categories.map((category, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <NextLink
                href={`/category/${category.parentCategoryName?.toLowerCase()}/${
                  category.categoryName
                }`}
                passHref
              >
                <Paper
                  sx={{
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: category.color,
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  <Stack direction={"column"} alignItems="center">
                    <Typography variant="h6">
                      {category.categoryName}
                    </Typography>

                    <Typography variant="subtitle2">
                      {`(${category.totalListings} items)`}
                    </Typography>
                  </Stack>
                </Paper>
              </NextLink>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
