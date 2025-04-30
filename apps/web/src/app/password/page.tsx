"use client";

import { useState, useEffect } from "react";
import { TextField, Button, Typography, Alert, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useUser } from "@auth0/nextjs-auth0";
import ProfileLayout from "@/libs/components/profileLayout";

export default function ChangePasswordPage() {
  const { user } = useUser();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);

  useEffect(() => {
    if (user?.sub && !user.sub.startsWith("auth0|")) {
      setIsGoogleLogin(true);
      setError("You cannot change your password as you logged in via google.");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const res = await fetch("/api/changepassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.sub,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Password has been changed successfully.");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Failed to change password. Password is too weak.");
      }
    } catch (error){
      console.error("Error changing password:", error);
      setError("Something went wrong.", );
    }
  };

  return (
    <ProfileLayout>
        <Typography variant="h5" mb={3} fontWeight="bold">
            Change Password
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
        <TextField
          label="New Password"
          type={showNewPassword ? "text" : "password"} 
          fullWidth
          required
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isGoogleLogin}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                {showNewPassword ? <VisibilityOff /> : <Visibility />} {/* Eye icon */}
              </IconButton>
            ),
          }}
        />
        <TextField
          label="Confirm New Password"
          type={showConfirmPassword ? "text" : "password"} 
          fullWidth
          required
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isGoogleLogin}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />} {/* Eye icon */}
              </IconButton>
            ),
          }}
        />
            <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isGoogleLogin} >
              Change your password
            </Button>
        </form>
    </ProfileLayout>
  );
}
