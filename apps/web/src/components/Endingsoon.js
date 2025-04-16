// import React, { useRef, useState } from "react";
// import { Box, Typography, Grid, Container, Card, CardContent, CardMedia, IconButton } from "@mui/material";
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// const endingSoonItems = [
//   { title: "Listing Name 1", price: "$600", time: "1h 10m", image: "/images/placeholder.png" },
//   { title: "Listing Name 2", price: "$610", time: "2h 15m", image: "/images/placeholder.png" },
//   { title: "Listing Name 3", price: "$590", time: "3h 5m", image: "/images/placeholder.png" },
//   { title: "Listing Name 4", price: "$620", time: "4h 20m", image: "/images/placeholder.png" },
//   { title: "Listing Name 5", price: "$580", time: "5h 30m", image: "/images/placeholder.png" },
//   { title: "Listing Name 6", price: "$600", time: "6h 45m", image: "/images/placeholder.png" },
// ];

// const EndingSoon = () => {
//   const [scrollIndex, setScrollIndex] = useState(0);
//   const scrollContainerRef = useRef(null);

//   const handleScroll = (direction) => {
//     if (!scrollContainerRef.current) return;

//     let newIndex = scrollIndex;
//     if (direction === "next" && scrollIndex < endingSoonItems.length - 4) {
//       newIndex += 1;
//     } else if (direction === "prev" && scrollIndex > 0) {
//       newIndex -= 1;
//     }

//     setScrollIndex(newIndex);
//     scrollContainerRef.current.scrollTo({
//       left: newIndex * 260, // Adjust width dynamically
//       behavior: "smooth",
//     });
//   };

//   return (
//     <Box sx={{ py: 6, overflow: "hidden" }}>
//       <Container>
//         <Typography variant="h5" sx={{ color: "#6F6F6F", fontWeight: "bold", mb: 3 }}>
//           Auctions Ending Soon
//         </Typography>

//         {/* Scrollable Listings with Buttons in Between */}
//         <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           {/* Left Arrow */}
//           <IconButton onClick={() => handleScroll("prev")} sx={{ bgcolor: "#E0E0E0", borderRadius: "50%", p: 1, mx: 1 }}>
//             <ArrowBackIosIcon />
//           </IconButton>

//           {/* Listings */}
//           <Box sx={{ display: "flex", overflowX: "auto", flexGrow: 1, scrollBehavior: "smooth" }} ref={scrollContainerRef}>
//             {endingSoonItems.map((item, index) => (
//               <Card
//                 key={index}
//                 sx={{
//                   minWidth: "20%", // Each card takes up 20% of the row for full width
//                   flexShrink: 0,
//                   mr: index === endingSoonItems.length - 1 ? 0 : 2,
//                   boxShadow: 2,
//                 }}
//               >
//                 <CardMedia component="img" height="140" image={item.image} alt={item.title} />
//                 <CardContent>
//                   <Typography variant="body1">{item.title}</Typography>
//                   <Typography color="text.secondary">Current Bid: {item.price}</Typography>
//                   <Typography color="error">Ending in: {item.time}</Typography>
//                 </CardContent>
//               </Card>
//             ))}
//           </Box>

//           {/* Right Arrow */}
//           <IconButton onClick={() => handleScroll("next")} sx={{ bgcolor: "#E0E0E0", borderRadius: "50%", p: 1, mx: 1 }}>
//             <ArrowForwardIosIcon />
//           </IconButton>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default EndingSoon;

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
