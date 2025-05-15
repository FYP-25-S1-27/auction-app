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

interface OfferFormProps {
  open: boolean;
  onClose: () => void;
  requestId: number;
  refreshOffers: () => void;
}

const OfferForm = ({ open, onClose, requestId, refreshOffers }: OfferFormProps) => {
  const [offerAmount, setOfferAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: requestId, // using the same field because 'listing_id' now refers to request or listing
          bid_amount: Number(offerAmount),
          bid_type: "OFFER", // important to distinguish offers from bids!
          user_uuid: "auth0|67d91134f8221c2f7344d9de", // Replace with actual user UUID
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit offer");
      }

      setOfferAmount("");
      refreshOffers(); // Refresh the offers list after successful offer
      onClose(); // Close the modal
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
    setOfferAmount("0"); // Assuming 0 means match? You can adjust if you have a specific value
    await handleSubmit();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Make an Offer</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Offer Amount (SGD)"
            type="number"
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
            fullWidth
            required
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleMatchOffer} color="secondary" variant="outlined">
          Match Offer
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
          {loading ? "Submitting..." : "Submit Offer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OfferForm;