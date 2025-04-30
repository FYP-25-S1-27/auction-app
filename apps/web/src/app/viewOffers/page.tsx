"use client";

import { useEffect, useState } from "react";
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from "@mui/material";

const ViewOffersPage = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("/api/offers");
        if (!res.ok) throw new Error("Failed to fetch offers");
        const data = await res.json();
        setOffers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        My Offers
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {offers.length > 0 ? (
        <List>
          {offers.map((offer) => (
            <ListItem key={offer.id}>
              <ListItemText
                primary={`Offer: $${offer.offerAmount}`}
                secondary={`Request ID: ${offer.requestId} | Time: ${new Date(offer.offerTime).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        !loading && <Typography>No offers found.</Typography>
      )}
    </Container>
  );
};

export default ViewOffersPage;
