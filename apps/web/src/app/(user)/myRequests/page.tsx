"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";

interface Request {
  id: number;
  name: string;
  description: string;
  category: string;
  startingPrice: number;
  imageUrls?: string[];
}

export default function MyRequestsPage() {
  const { user, isLoading } = useUser();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.sub) return;

      try {
        const res = await fetch(
          `/api/listings?listing_types=REQUEST&user_uuid=${encodeURIComponent(user.sub)}`
        );

        if (!res.ok) throw new Error("Failed to fetch requests");

        const data = await res.json();
        setRequests(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchRequests();
  }, [user]);

  if (isLoading || loading) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>
        My Requests
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Box mt={3}>
        {requests.length === 0 ? (
          <Typography>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Can't find what you're looking for? Make a request now!
          </Typography>
        ) : (
          requests.map((req) => (
            <Card key={req.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{req.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Category: {req.category}
                </Typography>
                <Typography>{req.description}</Typography>
                <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
                  Budget: ${req.startingPrice}
                </Typography>

                {req.imageUrls && req.imageUrls.length > 0 && (
                  <Box mt={2}>
                    <img
                      src={req.imageUrls[0]}
                      alt="Request Image"
                      style={{ width: "100%", maxHeight: 200, objectFit: "cover" }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
}
