import React from "react";
import Link from "next/link";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

const CategoryListings = ({ listings }) => {
  return (
    <Grid container spacing={3} justifyContent="center">
      {listings.map((listing, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Link href={`/listing/${listing.slug}`} passHref>
            <Card sx={{ boxShadow: 3, borderRadius: "8px", cursor: "pointer" }}>
              <Box
                sx={{
                  height: 180,
                  backgroundColor: "#D1D1D1",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                Image Placeholder
              </Box>
              <CardContent>
                <Typography variant="body1" fontWeight="bold">
                  {listing.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Current Bid:
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {listing.currentBid}
                </Typography>
                <Typography variant="body2" color="error" fontWeight="bold">
                  {listing.timeLeft}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryListings;
