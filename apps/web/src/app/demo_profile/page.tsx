"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Typography, Button, Box, Alert } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0";
import ProfileLayout from "@/libs/components/profileLayout";

const ProfilePage = () => {
  type JoinedUserProfile = {
    users: { uuid: string; username: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user_profile: { [key: string]: any };
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState("Profile Information");
  const auth = useUser();

  const [userProfiles, setUserProfiles] = useState<JoinedUserProfile[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) throw new Error("Failed to fetch profile");

        const data: JoinedUserProfile[] = await response.json();
        setUserProfiles(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    if (success === "1") {
      setShowSuccess(true);
      const timeout = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

      router.replace("/demo_profile", { scroll: false });
      return () => clearTimeout(timeout);
    }
  }, [success, router]);

  const handleEdit = (useruuid: string) => {
    router.push(`/viewprofile/${useruuid}`);
  };

  return (
    <ProfileLayout>
      {showSuccess && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          Your profile has been successfully updated!
        </Alert>
      )}

      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {activeTab}
      </Typography>
      <Box sx={{ marginTop: "16px" }}>
        {activeTab === "Profile Information" ? (
          userProfiles.map(({ users, user_profile }) => (
            <Box
              key={users.uuid}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                position: "relative",
              }}
            >
              <Typography variant="body2">
                <strong>Username:</strong> {users.username}
              </Typography>
              <Typography variant="body2">
                <strong>Gender:</strong>{" "}
                {user_profile?.gender || "Not specified"}
              </Typography>
              <Typography variant="body2">
                <strong>Email address:</strong>{" "}
                {auth.user?.email || "Email not available"}
              </Typography>
              <Typography variant="body2">
                <strong>Age:</strong> {user_profile?.age || "Not specified"}
              </Typography>
              <Typography variant="body2">
                <strong>Phone number:</strong>{" "}
                {user_profile?.phone || "Not provided"}
              </Typography>
              <Typography variant="body2">
                <strong>Interests:</strong> Sports, Cars
              </Typography>
              <Typography variant="body2" sx={{ gridColumn: "span 2" }}>
                <strong>Address:</strong>{" "}
                {user_profile?.address || "Not provided"}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                sx={{ position: "absolute", top: 0, right: 0 }}
                onClick={() => handleEdit(users.uuid)}
              >
                Edit
              </Button>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="gray">
            Content for {activeTab} will be displayed here.
          </Typography>
        )}
      </Box>
    </ProfileLayout>
  );
};

export default ProfilePage;
