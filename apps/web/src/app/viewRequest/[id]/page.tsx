"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Stack,
} from "@mui/material";
import OfferForm from "./offerForm"; // Adjust if needed

interface Request {
  id: number;
  name: string;
  description: string;
  category: string;
  startingPrice: number;
}

const ViewRequestPage = () => {
  const { id } = useParams();
  const [request, setRequest] = useState<Request | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOfferForm, setShowOfferForm] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (!res.ok) throw new Error("Failed to fetch request");
        const data: Request = await res.json();
        console.log("📦 Request data fetched from API:", data);
        setRequest(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRequest();
  }, [id]);

  const handleOpenOfferForm = () => setShowOfferForm(true);
  const handleCloseOfferForm = () => setShowOfferForm(false);

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 8 }}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : request ? (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Stack spacing={2}>
            <Typography variant="h4" fontWeight="bold">
              {request.name}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              Category: {request.category}
            </Typography>

            <Typography variant="body1" sx={{ mt: 2 }}>
              {request.description}
            </Typography>

            <Typography variant="h6" sx={{ mt: 3 }}>
              Budget:{" "}
              <Box component="span" fontWeight="bold" color="primary.main">
                ${request.startingPrice}
              </Box>
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenOfferForm}
                fullWidth
              >
                Make an Offer
              </Button>
            </Box>
          </Stack>

          {showOfferForm && (
            <OfferForm
              requestId={request.id}
              open={showOfferForm}
              refreshOffers={() => {}}
              onClose={handleCloseOfferForm}
            />
          )}
        </Paper>
      ) : (
        <Typography>No request found.</Typography>
      )}
    </Container>
  );
};

export default ViewRequestPage;
