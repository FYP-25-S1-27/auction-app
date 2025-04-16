import React from "react";
import { Box, Typography, Grid, Container, Card, CardContent, CardMedia, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const recommendedItems = [
  { title: "Listing Name", price: "$50,000", timeLeft: "1 day left", image: "/images/placeholder.png" },
  { title: "Listing Name", price: "$50,000", timeLeft: "1 day left", image: "/images/placeholder.png" },
  { title: "Listing Name", price: "$50,000", timeLeft: "1 day left", image: "/images/placeholder.png" },
  { title: "Listing Name", price: "$50,000", timeLeft: "1 day left", image: "/images/placeholder.png" },
  { title: "Listing Name", price: "$50,000", timeLeft: "1 day left", image: "/images/placeholder.png" },
];

const YouMightAlsoLike = () => {
  return (
    <Box sx={{ py: 6 }}> {/* ✅ Ensure proper spacing so it isn't cut off */}
      <Container>
        {/* Section Title */}
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
          You might also like
        </Typography>

        {/* Navigation Arrows */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <IconButton sx={{ bgcolor: "#E0E0E0", borderRadius: "50%", p: 1 }}>
            <ArrowBackIosIcon />
          </IconButton>
          <IconButton sx={{ bgcolor: "#E0E0E0", borderRadius: "50%", p: 1 }}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        {/* Auction Grid */}
        <Grid container spacing={3}>
          {recommendedItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ boxShadow: 2 }}>
                <CardMedia component="img" height="140" image={item.image} alt={item.title} />
                <CardContent>
                  <Typography variant="body1">{item.title}</Typography>
                  <Typography color="text.secondary">Current Bid: {item.price}</Typography>
                  <Typography color="error">{item.timeLeft}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default YouMightAlsoLike;
