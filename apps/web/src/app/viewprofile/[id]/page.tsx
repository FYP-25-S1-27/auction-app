"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Container, TextField, Button, CircularProgress, Alert, Typography,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, } from "@mui/material";

const EditProfile = () => {
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/viewprofile/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setFormData(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/updateprofile/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        // body: JSON.stringify({
        //   phone: formData.phone,
        //   // address: formData.address,
        //   // age: formData.age,
        // }),
      });

      console.log(formData);
      
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      router.push("/demo_profile?success=1");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mt: 3 }}>
        Edit Profile
      </Typography>

      {loading && <CircularProgress sx={{ mt: 3 }} />}
      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          name="username"
          label="Username"
          fullWidth
          value={formData.username || ""}
          onChange={handleChange}
          sx={{ mt: 3 }}
        />
        
        <TextField
            name="age"
            label="Age"
            fullWidth
            value={formData.age || ""}
            onChange={handleChange}
            sx={{ mt: 3 }}
          />
        
        <TextField
            name="phone"
            label="Phone"
            type="number"
            fullWidth
            value={formData.phone || ""}
            onChange={handleChange}
            sx={{ mt: 3 }}
          />

          <FormControl component="fieldset" sx={{ mt: 3 }}>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              row
              aria-label="gender"
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>

          <TextField
            name="address"
            label="Address"
            fullWidth
            multiline
            rows={3}
            value={formData.address || ""}
            onChange={handleChange}
            sx={{ mt: 3 }}
          />
        
        <Button variant="outlined" color="primary" sx={{ mt: 3}} onClick={() => router.push("/demo_profile")} > Cancel</Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3, ml: 2 }} > Save Changes
        </Button>
      </form>
    </Container>
  );
};

export default EditProfile;