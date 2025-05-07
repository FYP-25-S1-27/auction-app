"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  Box,
  Card,
  CardContent,
} from "@mui/material";

// ✅ Define Profile type
interface UserProfile {
  username: string;
  age: string;
  phone: string;
  address: string;
  gender: "MALE" | "FEMALE";
}

const ViewProfilePage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/viewprofile/${id}`);
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data: UserProfile = await res.json();
        setProfile(data);
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

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="sm">
        <CircularProgress sx={{ mt: 4 }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      {profile && (
        <Card>
          <CardContent>
            <Typography variant="h6">Username: {profile.username}</Typography>
            <Typography>Age: {profile.age}</Typography>
            <Typography>Phone: {profile.phone}</Typography>
            <Typography>Address: {profile.address}</Typography>
            <Typography>Gender: {profile.gender}</Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ViewProfilePage;
