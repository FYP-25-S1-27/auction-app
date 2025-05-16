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
import { useUser } from "@auth0/nextjs-auth0";
import OfferForm from "./offerForm";
import SendMessageButton from "@/libs/components/chats/SendMessageButton";

interface Request {
  id: number;
  name: string;
  description: string;
  category: string;
  startingPrice: number;
  user_uuid: string;
  seller_name?: string;
  seller_bio?: string;
}

const ViewRequestPage = () => {
  const { user, isLoading: userLoading } = useUser();
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

        const raw = await res.json();

        const data: Request = {
          id: raw.id,
          name: raw.name,
          description: raw.description,
          category: raw.category,
          startingPrice: raw.starting_price,
          user_uuid: raw.user_uuid,
          seller_name: raw.seller_name,
          seller_bio: raw.seller_bio,
        };

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

  const isOwnRequest = user?.sub === request?.user_uuid;

  return (
  <Container maxWidth="md" sx={{ mt: 6, mb: 8 }}>
    {loading || userLoading ? (
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
              {typeof request.startingPrice === "number"
                ? `$${request.startingPrice}`
                : "Not specified"}
            </Box>
          </Typography>

          {/* Offer button directly below budget */}
          {!isOwnRequest && (
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenOfferForm}
                fullWidth
              >
                Make an Offer
              </Button>
            </Box>
          )}

          <Typography variant="h6" sx={{ mt: 4 }}>
            About this requester
          </Typography>

          <Box display="flex" alignItems="center" gap={2} mt={2}>
            <Paper sx={{ width: 50, height: 50, borderRadius: "50%" }} />
            <Box>
              <Typography>
                {request.seller_name ?? "Unknown Requester"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {request.seller_bio ?? "Requester description"}
              </Typography>
            </Box>
          </Box>

          {/* Send Message button near user info */}
          {!isOwnRequest && (
            <Box sx={{ mt: 2 }}>
              <SendMessageButton
                otherPartyUuid={request.user_uuid}
                prefilledMessage={`Hi! I'm interested in your request for "${request.name}"`}
              />
            </Box>
          )}
        </Stack>

        {!isOwnRequest && showOfferForm && (
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
