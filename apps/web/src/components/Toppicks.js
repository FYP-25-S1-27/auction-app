import React, { useState } from "react";
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const topPicksData = [
  [
    { title: "Auction Item 1", price: "$50,000", image: "/images/placeholder.png" },
    { title: "Auction Item 2", price: "$48,000", image: "/images/placeholder.png" },
    { title: "Auction Item 3", price: "$45,000", image: "/images/placeholder.png" },
    { title: "Auction Item 4", price: "$42,000", image: "/images/placeholder.png" },
  ],
  [
    { title: "Auction Item 5", price: "$40,000", image: "/images/placeholder.png" },
    { title: "Auction Item 6", price: "$38,500", image: "/images/placeholder.png" },
    { title: "Auction Item 7", price: "$35,000", image: "/images/placeholder.png" },
    { title: "Auction Item 8", price: "$32,500", image: "/images/placeholder.png" },
  ],
];

const TopPicks = () => {
  const [currentPage, setCurrentPage] = useState(0);

  // Function to handle next button (arrow)
  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % topPicksData.length);
  };

  // Function to handle progress bar clicks
  const handleProgressClick = (index) => {
    setCurrentPage(index);
  };

  return (
    <Box sx={{ py: 6 }}>
      <Container>
        {/* Section Title */}
        <Typography variant="h4" sx={{ color: "#007C5F", mb: 1 }}>
          Top picks in each collection
        </Typography>

        {/* Progress Bar with Arrow */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          {topPicksData.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 25,
                height: 5,
                borderRadius: 2,
                bgcolor: currentPage === index ? "#007C5F" : "#D3D3D3",
                cursor: "pointer",
              }}
              onClick={() => handleProgressClick(index)}
            />
          ))}
          {/* Arrow Button */}
          <IconButton onClick={handleNext} sx={{ p: 0, ml: 1 }}>
            <ArrowForwardIosIcon sx={{ fontSize: 16, color: "#007C5F" }} />
          </IconButton>
        </Box>

        {/* Auction Grid (Displays Current Page's Items) */}
        <Grid container spacing={3}>
          {topPicksData[currentPage].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ boxShadow: 3 }}>
                <CardMedia component="img" height="140" image={item.image} alt={item.title} />
                <CardContent>
                  <Typography variant="body1">{item.title}</Typography>
                  <Typography color="text.secondary">Current Bid: {item.price}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TopPicks;
