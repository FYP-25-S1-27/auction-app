"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Switch,
  Alert,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const ListingForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [starting_price, setstarting_price] = useState("");
  const [end_time, setend_time] = useState<dayjs.Dayjs | null>(null);
  const [scheduled, setScheduled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Reset errors on new submit

    // **Validation Checks**
    if (Number(starting_price) < 0) {
      setError("Starting price cannot be negative.");
      return;
    }
    if (end_time && end_time.isBefore(dayjs())) {
      setError("End time cannot be before the current time.");
      return;
    }

    // ✅ Convert `end_time` to a proper ISO string before sending
    const end_timeString = end_time ? end_time.toDate().toISOString() : null;

    const listingData = {
      name,
      category,
      condition,
      description,
      starting_price: Number(starting_price), // Ensure it's a number
      end_time: end_timeString, // ✅ Send as an ISO string
      scheduled,
    };

    console.log("📩 Submitting:", listingData);

    const response = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(listingData),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Something went wrong");
      return;
    }

    console.log("✅ Server Response:", data);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5 }}>
        <h2>UPLOAD PHOTOS AND VIDEO</h2>
        <Box sx={{ border: "2px dashed #ccc", padding: 6, textAlign: "center", mb: 4 }}>
          Drag and Drop Files Here
        </Box>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <TextField
          label="Listing Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        {/* Category */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Item Category</InputLabel>
          <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <MenuItem value="Art">Art</MenuItem>
            <MenuItem value="Books">Books</MenuItem>
            <MenuItem value="Cars">Cars</MenuItem>
          </Select>
        </FormControl>

        {/* Condition */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Item Condition</InputLabel>
          <Select value={condition} onChange={(e) => setCondition(e.target.value)} required>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="used">Used</MenuItem>
            <MenuItem value="heavily_used">Heavily Used</MenuItem>
          </Select>
        </FormControl>

        {/* Condition Description */}
        <TextField
          label="Condition Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
          margin="normal"
          multiline
          rows={3}
        />

        {/* Starting Price */}
        <TextField
          label="Starting Price"
          type="number"
          value={starting_price}
          onChange={(e) => setstarting_price(e.target.value)}
          fullWidth
          required
          margin="normal"
        />

        {/* End Time */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Auction End Time"
            value={end_time}
            onChange={(newValue) => setend_time(newValue)}
          />
        </LocalizationProvider>

        {/* Schedule Toggle */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <p>Schedule Your Listing</p>
          <Switch checked={scheduled} onChange={(e) => setScheduled(e.target.checked)} />
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="contained" color="primary" type="submit">
            List Now
          </Button>
          <Button variant="outlined" color="secondary">
            Save Draft
          </Button>
          <Button variant="outlined">Preview</Button>
        </Box>
      </form>
    </Container>
  );
};

export default ListingForm;
