import React, { useState } from "react";
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, IconButton, Slide } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const endingSoonItems = [
  { title: "Designer Furniture Auction", curator: "Jochen Kloeters", image: "/images/placeholder.png" },
  { title: "Industrial Design Auction", curator: "Christian Plat", image: "/images/placeholder.png" },
  { title: "Vintage Furniture Auction", curator: "Francisco Álvarez", image: "/images/placeholder.png" },
  { title: "Contemporary Designer Lighting", curator: "Henri Daumont", image: "/images/placeholder.png" },
  { title: "Lighting Auction", curator: "John Bolt", image: "/images/placeholder.png" },
  { title: "Mediterranean House Auction", curator: "Francisco Álvarez", image: "/images/placeholder.png" },
  { title: "New Orleans Rhythm Auction", curator: "Clément Floch", image: "/images/placeholder.png" },
  { title: "Modern Rug Auction", curator: "Richard Ebbers", image: "/images/placeholder.png" },
  { title: "Boho Chic Auction", curator: "Fiammetta Fulchati", image: "/images/placeholder.png" },
  { title: "Garden Decor Auction", curator: "Ger Van Oers", image: "/images/placeholder.png" },
];

const ITEMS_PER_PAGE = 5; // Show 5 items per page

const EndingSoon = () => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState("left"); // Control animation direction
  const totalPages = Math.ceil(endingSoonItems.length / ITEMS_PER_PAGE);

  const handleNext = () => {
    if (page < totalPages - 1) {
      setDirection("left");
      setPage(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      setDirection("right");
      setPage(page - 1);
    }
  };

  return (
    <Box sx={{ py: 6, overflow: "hidden", width: "100vw", bgcolor: "white" }}>
      <Container maxWidth="lg">
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
          Auctions Ending Soon
        </Typography>

        {/* Navigation & Listings */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Left Arrow (Hidden on First Page) */}
          <IconButton onClick={handlePrev} sx={{ visibility: page === 0 ? "hidden" : "visible" }}>
            <ArrowBackIosIcon />
          </IconButton>

          {/* Animated Listings */}
          <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
            <Slide direction={direction} in={true} mountOnEnter unmountOnExit>
              <Grid container spacing={2}>
                {endingSoonItems.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE).map((item, index) => (
                  <Grid item xs={12} sm={6} md={2.4} key={index}>
                    <Card sx={{ boxShadow: 2 }}>
                      <CardMedia component="img" height="140" image={item.image} alt={item.title} />
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">
                          Curated by {item.curator}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                          {item.title}
                        </Typography>
                        <Typography color="error">Ending now!</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Slide>
          </Box>

          {/* Right Arrow (Hidden on Last Page) */}
          <IconButton onClick={handleNext} sx={{ visibility: page === totalPages - 1 ? "hidden" : "visible" }}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default EndingSoon;


// import React, { useState, useEffect } from "react";
// import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, IconButton } from "@mui/material";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// const EndingSoon = () => {
//   const [listings, setListings] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);

//   useEffect(() => {
//     const fetchListings = async () => {
//       try {
//         const response = await fetch(`/api/listings?type=ending_soon&page=${currentPage}`);
//         const data = await response.json();
//         setListings(data);
//       } catch (error) {
//         console.error("Error fetching ending soon listings:", error);
//       }
//     };

//     fetchListings();
//   }, [currentPage]);

//   return (
//     <Box sx={{ py: 6 }}>
//       <Container>
//         <Typography variant="h4" sx={{ color: "#007C5F", mb: 1 }}>
//           Auctions Ending Soon
//         </Typography>

//         <Grid container spacing={3}>
//           {listings.slice(currentPage * 5, (currentPage + 1) * 5).map((item, index) => (
//             <Grid item xs={12} sm={6} md={3} key={index}>
//               <Card sx={{ boxShadow: 3 }}>
//                 <CardMedia component="img" height="140" image="/images/placeholder.png" alt={item.name} />
//                 <CardContent>
//                   <Typography variant="body1">{item.name}</Typography>
//                   <Typography color="text.secondary">Current Bid: ${item.currentPrice}</Typography>
//                   <Typography color="error">Ends: {new Date(item.endTime).toLocaleString()}</Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default EndingSoon;
