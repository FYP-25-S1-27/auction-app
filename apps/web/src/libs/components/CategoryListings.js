import React from "react";
import Link from "next/link";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

// Function to calculate time left for the bid
const calculateTimeLeft = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now; // Difference

  if (diff <= 0) {
    return "Expired"; // If the time has passed
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ${hours} hour${
      hours > 1 ? "s" : ""
    }`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
      minutes > 1 ? "s" : ""
    }`;
  } else {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
};

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
                {/* Image Placeholder */}
                {listing.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={listing.imageUrl}
                    alt={listing.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "No image available"
                )}
              </Box>
              <CardContent>
                <Typography variant="body1" fontWeight="bold">
                  {listing.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Current Bid:
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {listing.currentPrice}
                </Typography>
                <Typography variant="body2" color="error" fontWeight="bold">
                  {calculateTimeLeft(listing.endTime)} left
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
