"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { listings } from "@/libs/db/schema";

const MyListings = () => {
  const [_listings, setListings] = useState<(typeof listings.$inferSelect)[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/mylistings");

        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }

        const data = await response.json();
        setListings(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleEdit = (listingId: number) => {
    router.push(`/viewlistings/${listingId}`);
  };

  const handleDelete = async (listingId: number) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const response = await fetch(`/api/deletelisting/${listingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete listing");
      }

      setListings((prevListings) =>
        prevListings.filter((item) => item.id !== Number(listingId))
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 3 }}>
        My Listings
      </Typography>

      {loading && <CircularProgress sx={{ mt: 3 }} />}
      {error && <Alert severity="error">{error}</Alert>}

      <List sx={{ mt: 3 }}>
        {_listings.map((listing) => (
          <ListItem
            key={listing.id}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <ListItemText
              primary={listing.name}
              secondary={`Category: ${listing.category} | Price: $${listing.starting_price}`}
            />
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEdit(listing.id)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                sx={{ ml: 2 }}
                onClick={() => handleDelete(listing.id)}
              >
                Delete
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default MyListings;
