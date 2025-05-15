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
} from "@mui/material";

interface Bid {
  id: number;
  listingname: string;
  bidAmt: number;
  bidTime: string;
  listingId: number;
}

const MyBidsPage = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/mybids");

        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }

        const data = await response.json();
        setBids(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <Container maxWidth="md" sx={{ minHeight: "80vh" }}>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      
      <Typography variant="h4" sx={{ mt: 3 }}>
        My Bids
      </Typography>

      <List sx={{ mt: 3 }}>
        {bids.map((bid) => (
          <ListItem
            key={bid.id}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <ListItemText
              primary={bid.listingname}
              secondary={`Bid Amount: $${bid.bidAmt} | Bid Time: ${ bid.bidTime ? new Date(bid.bidTime).toLocaleString() : "Unknown" }`}
            />
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push(`/listing/${bid.listingId}`)}
              >
                View
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default MyBidsPage;