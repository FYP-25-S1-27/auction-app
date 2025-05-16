"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";

interface OfferFormProps {
  open: boolean;
  onClose: () => void;
  requestId: number;
  refreshOffers: () => void;
}

const OfferForm = ({ open, onClose, requestId, refreshOffers }: OfferFormProps) => {
  const { user, isLoading } = useUser();

  const [offerAmount, setOfferAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      if (!user?.sub) {
        throw new Error("You must be logged in to submit an offer.");
      }

      const response = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: requestId,
          bid_amount: Number(offerAmount),
          bid_type: "OFFER",
          user_uuid: user.sub,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit offer");
      }

      setOfferAmount("");
      refreshOffers();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMatchOffer = async () => {
    setOfferAmount("0"); // Convention for "Match Offer"
    await handleSubmit();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Make an Offer</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Offer Amount"
            type="number"
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
            fullWidth
            required
            disabled={!user && !isLoading}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleMatchOffer} color="secondary" variant="outlined" disabled={!user}>
          Match Offer
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading || !user}>
          {loading ? "Submitting..." : "Submit Offer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OfferForm;
