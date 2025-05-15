"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Box, Card, CardContent } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";

interface Request {
  id: number;
  title: string;
  description: string;
  category: string;
  createdAt: string;
}

export default function MyRequestsPage() {
  const { user, isLoading } = useUser();
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user?.sub) return;

      try {
        const res = await fetch(`/api/requests?user_uuid=${user.sub}`);
        if (res.ok) {
          const data = await res.json();
          setRequests(data);
        } else {
          console.error("Failed to fetch requests");
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    if (user) fetchRequests();
  }, [user]);

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4 }}>
        My Requests
      </Typography>
      <Box mt={3}>
        {requests.length === 0 ? (
          <Typography>Can't find what you're looking for? Make a request now!</Typography>
        ) : (
          requests.map((req) => (
            <Card key={req.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{req.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Category: {req.category}
                </Typography>
                <Typography>{req.description}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Created at: {new Date(req.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
}
