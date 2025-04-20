"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  Card,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

const tabs = [
  { label: "Profile Information", path: "/profile" },
  { label: "Payment Methods", path: "/profile/payment" },
  { label: "Address book", path: "/profile/address" },
  { label: "Interests", path: "/profile/interests" },
];

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [username, setUsername] = useState<string>("user");
  const router = useRouter();
  const pathname = usePathname();
  type JoinedUserProfile = {
    users: { uuid: string; username: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user_profile: { [key: string]: any };
  };
  const [userProfiles, setUserProfiles] = useState<JoinedUserProfile[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data: JoinedUserProfile[] = await res.json();
        setUserProfiles(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  return (
    <Box
      sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5", padding: "24px" }}
    >
      <Box sx={{ display: "flex", gap: 4, marginTop: 4 }}>
        {/* Sidebar */}
        <Card sx={{ padding: "24px", width: "300px", borderRadius: "12px" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Hello{" "}
            {userProfiles.length > 0 ? userProfiles[0].users.username : "user"}
          </Typography>
          <List>
            {tabs.map((tab) => (
              <ListItemButton
                key={tab.label}
                onClick={() => router.push(tab.path)}
                selected={pathname === tab.path}
              >
                <ListItemText
                  primary={tab.label}
                  primaryTypographyProps={{
                    sx: {
                      color: pathname === tab.path ? "#388e3c" : "#1976d2",
                    },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Card>

        {/* Page Content */}
        <Card sx={{ flex: 1, padding: "24px", borderRadius: "12px" }}>
          {children}
        </Card>
      </Box>
    </Box>
  );
};

export default ProfileLayout;
