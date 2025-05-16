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
import { useUser } from "@auth0/nextjs-auth0";

interface Offer {
  id: number;
  offerAmount: number;
  requestId: number;
  offerTime: string;
  title: string;
}

const ViewOffersPage = () => {
  const { user, isLoading: authLoading } = useUser();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adjustingOfferId, setAdjustingOfferId] = useState<number | null>(null);
  const [newAmount, setNewAmount] = useState<string>("");
  const router = useRouter();

  const fetchOffers = async () => {
    if (!user?.sub) {
      setError("You must be logged in to view your offers.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/offers?user_uuid=${encodeURIComponent(user.sub)}`
      );
      if (!res.ok) throw new Error("Failed to fetch offers");

      const rawData = await res.json();
      const mapped: Offer[] = rawData.map(
        (offer: {
          id: number;
          bidAmount: number;
          bidTime: string;
          listingId: number;
          title: string;
        }) => ({
          id: offer.id,
          offerAmount: offer.bidAmount,
          requestId: offer.listingId,
          offerTime: offer.bidTime,
          title: offer.title || "Untitled Request",
        })
      );
      setOffers(mapped);
    } catch (err) {
      console.error("Failed to fetch offers:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleViewRequest = (id: number) => {
    router.push(`/viewRequest/${id}`);
  };

  const handleRetract = async (id: number) => {
    const confirm = window.confirm(
      "Are you sure you want to retract this offer?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to retract offer");
      await fetchOffers(); // Refresh list
    } catch (err) {
      console.error("Failed to retract offer:", err);
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
      console.error("Failed to update offer:", err);
      alert("Failed to update offer.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        My Offers
      </Typography>

      {(loading || authLoading) && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {offers.length > 0 ? (
        <List>
          {offers.map((offer) => (
            <ListItem key={offer.id} alignItems="flex-start" divider>
              <ListItemText
                primary={
                  <Stack spacing={0.5}>
                    <Typography variant="h6">
                      Offer: ${offer.offerAmount}
                    </Typography>
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
                <Button
                  variant="outlined"
                  onClick={() => handleViewRequest(offer.requestId)}
                >
                  View Request
                </Button>
                <Button
                  variant="text"
                  color="warning"
                  onClick={() => openAdjustModal(offer.id, offer.offerAmount)}
                >
                  Adjust
                </Button>
                <Button
                  variant="text"
                  color="error"
                  onClick={() => handleRetract(offer.id)}
                >
                  Retract
                </Button>
              </Stack>
            </ListItem>
          ))}
        </List>
      ) : (
        !loading && !authLoading && <Typography>No offers found.</Typography>
      )}

      {/* Adjust Offer Modal */}
      <Dialog
        open={adjustingOfferId !== null}
        onClose={() => setAdjustingOfferId(null)}
      >
        <DialogTitle>Adjust Your Offer</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Offer Amount"
            value={newAmount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || Number(value) >= 1) {
                setNewAmount(value);
              }
            }}
            type="number"
            sx={{ mt: 2 }}
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustingOfferId(null)}>Cancel</Button>
          <Button
            onClick={handleAdjust}
            variant="contained"
            disabled={
              newAmount === "" || isNaN(Number(newAmount)) || Number(newAmount) < 1
            }
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewOffersPage;
