"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";

interface Offer {
  id: number;
  offerAmount: number;
  requestId: number;
  offerTime: string;
  title: string;
}

const ViewOffersPage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adjustingOfferId, setAdjustingOfferId] = useState<number | null>(null);
  const [newAmount, setNewAmount] = useState<string>("");
  const router = useRouter();

  const userUuid = "auth0|67d91134f8221c2f7344d9de"; // your test user

  const fetchOffers = async () => {
    try {
      const res = await fetch(`/api/offers?user_uuid=${encodeURIComponent(userUuid)}`);
      if (!res.ok) throw new Error("Failed to fetch offers");

      const rawData = await res.json();
      const mapped: Offer[] = rawData.map((offer: any) => ({
        id: offer.id,
        offerAmount: offer.bidAmount,
        requestId: offer.listingId,
        offerTime: offer.bidTime,
        title: offer.title || "Untitled Request",
      }));
      setOffers(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleViewRequest = (id: number) => {
    router.push(`/viewRequest/${id}`);
  };

  const handleRetract = async (id: number) => {
    const confirm = window.confirm("Are you sure you want to retract this offer?");
    if (!confirm) return;

    try {
      const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to retract offer");
      await fetchOffers(); // Refresh list
    } catch (err) {
      alert("Failed to retract offer.");
    }
  };

  const openAdjustModal = (id: number, currentAmount: number) => {
    setAdjustingOfferId(id);
    setNewAmount(String(currentAmount));
  };

  const handleAdjust = async () => {
    if (!adjustingOfferId || isNaN(Number(newAmount))) return;

    try {
      const res = await fetch(`/api/offers/${adjustingOfferId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bid_amount: Number(newAmount) }),
      });

      if (!res.ok) throw new Error("Failed to update offer");
      setAdjustingOfferId(null);
      setNewAmount("");
      await fetchOffers(); // Refresh list
    } catch (err) {
      alert("Failed to update offer.");
    }
  };

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
            <ListItem key={offer.id} alignItems="flex-start" divider>
              <ListItemText
                primary={
                  <Stack spacing={0.5}>
                    <Typography variant="h6">Offer: ${offer.offerAmount}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Request: {offer.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Time: {new Date(offer.offerTime).toLocaleString()}
                    </Typography>
                  </Stack>
                }
              />
              <Stack spacing={1} direction="column" alignItems="flex-end">
                <Button variant="outlined" onClick={() => handleViewRequest(offer.requestId)}>
                  View Request
                </Button>
                <Button variant="text" color="warning" onClick={() => openAdjustModal(offer.id, offer.offerAmount)}>
                  Adjust
                </Button>
                <Button variant="text" color="error" onClick={() => handleRetract(offer.id)}>
                  Retract
                </Button>
              </Stack>
            </ListItem>
          ))}
        </List>
      ) : (
        !loading && <Typography>No offers found.</Typography>
      )}

      {/* Adjust Offer Modal */}
      <Dialog open={adjustingOfferId !== null} onClose={() => setAdjustingOfferId(null)}>
        <DialogTitle>Adjust Your Offer</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Offer Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            type="number"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustingOfferId(null)}>Cancel</Button>
          <Button onClick={handleAdjust} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewOffersPage;
