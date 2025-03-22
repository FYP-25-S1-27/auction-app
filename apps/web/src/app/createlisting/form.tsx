"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  CircularProgress,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { InferSelectModel } from "drizzle-orm";
import { listingCategory } from "@/libs/db/schema";

const ListingForm = () => {
  const router = useRouter(); // ✅ Use Next.js router for navigation
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [starting_price, setstarting_price] = useState("");
  const [end_time, setend_time] = useState<dayjs.Dayjs | null>(null);
  const [scheduled, setScheduled] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // ✅ Loading state

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true); // ✅ Show loading while submitting

    // **Validation Checks**
    if (Number(starting_price) < 0) {
      setError("Starting price cannot be negative.");
      setLoading(false);
      return;
    }
    if (end_time && end_time.isBefore(dayjs())) {
      setError("End time cannot be before the current time.");
      setLoading(false);
      return;
    }
    if (scheduled) {
      if (!start_time || start_time.isBefore(dayjs())) {
        setError("Scheduled listings must have a start time in the future.");
        return;
      }
      if (end_time && (start_time.isAfter(end_time) || start_time.isSame(end_time))) {
        setError("Scheduled time must be before end time.");
        return;
      }
    }

    // ✅ Convert `end_time` to ISO format before sending
    const end_timeString = end_time ? end_time.toISOString() : null;

    const listingData = {
      name,
      category,
      condition,
      description,
      starting_price: Number(starting_price),
      end_time: end_timeString,
      scheduled,
    };

    console.log("📩 Submitting:", listingData);

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      console.log("✅ Listing created successfully:", data);
      router.push("/"); // ✅ Redirect to homepage upon success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5 }}>
        {error && <Alert severity="error">{error}</Alert>}

          {/* success message */}
          <Snackbar
            open={showSuccess}
            autoHideDuration={5000}
            onClose={() => setShowSuccess(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setShowSuccess(false)}
              severity="success"
              sx={{ width: "100%" }}
            >
              Listing has created successfully!
            </Alert>
          </Snackbar>

        <h2>UPLOAD PHOTOS AND VIDEO</h2>
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed #aaa",
            padding: "30px",
            borderRadius: "8px",
            textAlign: "center",
            cursor: "pointer",
            background: isDragActive ? "#f0f0f0" : "#fafafa",
            mb: 3,
          }}
        >
          <input {...getInputProps()} />
          <Typography color="text.secondary">
            Drag and drop files here, or click to select files
          </Typography>
        </Box>

        <Box display="flex" gap={2} flexWrap="wrap">
          {files.map((file, i) => (
            <Box
              key={i}
              position="relative"
              sx={{ width: 100, height: 100, borderRadius: 2, overflow: "hidden", boxShadow: 1, }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField label="Listing Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required margin="normal" />

        <FormControl fullWidth margin="normal">
          <InputLabel>Item Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryHierarchy.map((cat) => (
              <MenuItem key={cat.name} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Item Condition</InputLabel>
          <Select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="used">Used</MenuItem>
            <MenuItem value="heavily_used">Heavily Used</MenuItem>
          </Select>
        </FormControl>

        <TextField label="Condition Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth required margin="normal" multiline rows={3} />

        <TextField label="Starting Price" type="number" value={starting_price} onChange={(e) => setstarting_price(e.target.value)} fullWidth required margin="normal" />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker label="Auction End Time" value={end_time} onChange={(newValue) => setend_time(newValue)} />
        </LocalizationProvider>

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <p>Schedule Your Listing</p>
          <Switch checked={scheduled} onChange={(e) => setScheduled(e.target.checked)}/>
        </Box>
        
        {/* Scheduled Start Time (ADDED THIS) */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Listing Start Time"
            value={start_time}
            onChange={(newValue) => setstart_time(newValue)}
            disabled={!scheduled} // disable the field if not scheduled
          />
        </LocalizationProvider>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "List Now"}
          </Button>
        </Box>
        &nbsp;
      </form>
    </Container>
  );
};

export default ListingForm;