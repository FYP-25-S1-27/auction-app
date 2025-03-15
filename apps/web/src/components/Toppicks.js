import React, { useState, useEffect } from "react";
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

  // Auto-cycle timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % topPicksData.length);
    }, 5000); // Switch every 5 seconds
    return () => clearInterval(interval);
  }, []);

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
          <Box sx={{ width: "10%",gap: 1, display: "flex", justifyContent: "space-between" }}>
            {topPicksData.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: "200%", // Increased length
                  height: 5,
                  bgcolor: currentPage === index ? "#007C5F" : "#D3D3D3",
                  cursor: "pointer",
                  borderRadius: "0px", // Squared edges
                }}
                onClick={() => handleProgressClick(index)}
              />
            ))}
          </Box>
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


// import React, { useState, useEffect } from "react";
// import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, IconButton } from "@mui/material";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// const TopPicks = () => {
//   const [listings, setListings] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);

//   useEffect(() => {
//     const fetchListings = async () => {
//       try {
//         const response = await fetch(`/api/listings?type=top_picks&page=${currentPage}`);
//         const data = await response.json();
//         setListings(data);
//       } catch (error) {
//         console.error("Error fetching top picks:", error);
//       }
//     };

//     fetchListings();
//   }, [currentPage]);

//   // Auto-cycle through categories
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentPage((prev) => (prev + 1) % 5); // Cycle through categories
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <Box sx={{ py: 6 }}>
//       <Container>
//         <Typography variant="h4" sx={{ color: "#007C5F", mb: 1 }}>
//           Top picks in each collection
//         </Typography>

//         {/* Progress Bar */}
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
//           {Array.from({ length: 5 }).map((_, index) => (
//             <Box
//               key={index}
//               sx={{
//                 width: "200%",
//                 height: 5,
//                 bgcolor: currentPage === index ? "#007C5F" : "#D3D3D3",
//                 cursor: "pointer",
//                 borderRadius: 0,
//               }}
//               onClick={() => setCurrentPage(index)}
//             />
//           ))}
//           <IconButton onClick={() => setCurrentPage((prev) => (prev + 1) % 5)} sx={{ p: 0, ml: 1 }}>
//             <ArrowForwardIosIcon sx={{ fontSize: 16, color: "#007C5F" }} />
//           </IconButton>
//         </Box>

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

// export default TopPicks;
