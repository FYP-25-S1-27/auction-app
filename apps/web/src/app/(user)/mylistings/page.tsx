"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  CircularProgress,
  Alert,Divider, Tabs, Tab, Link
} from "@mui/material";
import { listings } from "@/libs/db/schema";

const MyListings = () => {
  const [_listings, setListings] = useState<(typeof listings.$inferSelect)[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const updated = searchParams.get("updated") === "true";
  const [showSuccess, setShowSuccess] = useState(updated);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    if (updated) {
      // Clear success message after 5 seconds
      const timeout = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      router.replace("/mylistings", { scroll: false });
      return () => clearTimeout(timeout);
    }
  }, [updated, router]);

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
  const now = new Date();
  const categorizedListings = {
    upcoming: _listings.filter((l) => new Date(l.startTime) > now),
    ongoing: _listings.filter((l) => l.status === "ACTIVE" && new Date(l.startTime) <= now && new Date(l.endTime) >= now),
    sold: _listings.filter((l) => new Date(l.endTime) < now ),
  };

  const tabLabels = ["Upcoming listings", "Ongoing listings", "Sold/Expired listings"];
  const tabKeys = ["upcoming", "ongoing", "sold"] as const;

  return (
    <Container maxWidth="md" sx={{ minHeight: "80vh" }}>
      <Typography variant="h4" sx={{ mt: 3 }}>
        My Listings
      </Typography>

      {loading && <CircularProgress sx={{ mt: 3 }} />}
      {error && <Alert severity="error">{error}</Alert>}
      {showSuccess && (
        <Alert severity="success">Your listing had updated successfully!</Alert>
      )}

      <Tabs
        value={currentTab}
        onChange={(e, newValue) => setCurrentTab(newValue)}
        sx={{ mt: 3 }}
        centered
      >
        {tabLabels.map((label, i) => (
          <Tab label={label} key={i} />
        ))}
      </Tabs>

      <Box mt={3}>
        {categorizedListings[tabKeys[currentTab]].length === 0 ? (
          <Typography>No listings in this tab.</Typography>
        ) : (
          <List>
            {categorizedListings[tabKeys[currentTab]].map((listing) => (
              <Box key={listing.id}>
                <ListItem
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Link
                    href={`/listing/${listing.id}`}
                    style={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
                  >
                  <ListItemText
                    primary={listing.name}
                    secondary={`Category: ${listing.category} | Price: $${listing.startingPrice}`}
                  />
                  </Link>
                  {new Date(listing.endTime) > new Date() && (
                  <Box>
                    <Button
                      variant="contained"
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
                  )}
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
};

export default MyListings;