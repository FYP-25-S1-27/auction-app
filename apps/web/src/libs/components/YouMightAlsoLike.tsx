import {
  Box,
  Typography,
  Grid,
  Container,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { listings } from "../db/schema";

const recommendedItems = [
  {
    title: "Listing Name",
    price: "$50,000",
    timeLeft: "1 day left",
    image: "/images/placeholder.png",
  },
  {
    title: "Listing Name",
    price: "$50,000",
    timeLeft: "1 day left",
    image: "/images/placeholder.png",
  },
  {
    title: "Listing Name",
    price: "$50,000",
    timeLeft: "1 day left",
    image: "/images/placeholder.png",
  },
  {
    title: "Listing Name",
    price: "$50,000",
    timeLeft: "1 day left",
    image: "/images/placeholder.png",
  },
  {
    title: "Listing Name",
    price: "$50,000",
    timeLeft: "1 day left",
    image: "/images/placeholder.png",
  },
];

export default async function YouMightAlsoLike({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  recommendedListings,
}: {
  recommendedListings?: (typeof listings.$inferSelect)[];
}) {
  return (
    <Box sx={{ py: 6 }}>
      {" "}
      {/* ✅ Ensure proper spacing so it isn't cut off */}
      <Container>
        {/* Section Title */}
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
          You might also like
        </Typography>

        {/* Navigation Arrows */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
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
                <CardMedia
                  component="img"
                  height="140"
                  image={item.image}
                  alt={item.title}
                />
                <CardContent>
                  <Typography variant="body1">{item.title}</Typography>
                  <Typography color="text.secondary">
                    Current Bid: {item.price}
                  </Typography>
                  <Typography color="error">{item.timeLeft}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// import React, { useState, useEffect } from "react";
// import { Box, Typography, Container, Grid, Card, CardContent, CardMedia } from "@mui/material";

// const YouMightAlsoLike = () => {
//   const [listings, setListings] = useState([]);

//   useEffect(() => {
//     const fetchListings = async () => {
//       try {
//         const response = await fetch("/api/listings?type=you_might_also_like");
//         const data = await response.json();
//         setListings(data);
//       } catch (error) {
//         console.error("Error fetching similar listings:", error);
//       }
//     };

//     fetchListings();
//   }, []);

//   return (
//     <Box sx={{ py: 6 }}>
//       <Container>
//         <Typography variant="h4" sx={{ color: "#007C5F", mb: 1 }}>
//           You Might Also Like
//         </Typography>

//         <Grid container spacing={3}>
//           {listings.map((item, index) => (
//             <Grid item xs={12} sm={6} md={3} key={index}>
//               <Card sx={{ boxShadow: 3 }}>
//                 <CardMedia component="img" height="140" image="/images/placeholder.png" alt={item.name} />
//                 <CardContent>
//                   <Typography variant="body1">{item.name}</Typography>
//                   <Typography color="text.secondary">Current Bid: ${item.currentPrice}</Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default YouMightAlsoLike;
