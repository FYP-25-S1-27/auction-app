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
  Divider,
  Box,
  CardMedia,
} from "@mui/material";
import { useRouter } from "next/navigation";

interface Request {
  id: number;
  name: string;
  category: string;
  startingPrice: number;
  description: string;
  imageUrls?: string[];
}

const ViewAllRequestsPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/listings?listing_types=REQUEST");
        if (!res.ok) throw new Error("Failed to fetch requests");

        const data = await res.json();
        setRequests(data.items || []);
      } catch (err) {
        console.error("❌ Error fetching requests:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleClick = (id: number) => {
    router.push(`/viewRequest/${id}`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        What Others Are Looking For
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {requests.length > 0 ? (
        <List>
          {requests.map((request) => (
            <Box key={request.id}>
              <ListItem component="button" onClick={() => handleClick(request.id)} alignItems="flex-start">
                <ListItemText
                  primary={
                    <>
                      <Typography variant="h6">
                        {request.name} - ${request.startingPrice}
                      </Typography>
                      {(request.imageUrls?.length ?? 0) > 0 && (
                        <CardMedia
                          component="img"
                          height="150"
                          sx={{ mt: 1, borderRadius: 1, objectFit: "cover" }}
                          image={request.imageUrls![0]}
                          alt={request.name}
                        />
                      )}
                    </>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        Category: {request.category}
                      </Typography>
                      <br />
                      <Typography variant="body2" component="span">
                        {request.description.slice(0, 100)}...
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </Box>
          ))}
        </List>
      ) : (
        !loading && <Typography>No requests found.</Typography>
      )}
    </Container>
  );
};

export default ViewAllRequestsPage;
