"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Tab, Grid, Stack } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { TopListingsInCategory } from "@/app/api/toppicks/route";
import ListingCard from "./listings/ListingCard";

export default function TopPicks() {
  const [topPicks, setTopPicks] = useState<TopListingsInCategory>([]);
  const [currentTab, setCurrentTab] = useState(1);
  const [count, setCount] = useState(0);
  const [tabCount, setTabCount] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  async function fetchTopPicks() {
    const response = await fetch("/api/toppicks");
    if (!response.ok) {
      throw new Error("Failed to fetch top picks");
    }
    const data = await response.json();
    setTopPicks(data);
  }

  useEffect(() => {
    fetchTopPicks().catch((error) => {
      console.error("Error fetching top picks:", error);
    });

    // Set the number of tabs based on the length of topPicks, 4 items per tab
    setTabCount(
      topPicks.length % 4 === 0
        ? topPicks.length / 4
        : Math.floor(topPicks.length / 4) + 1
    );
    console.log("Tab count:", tabCount);
    const interval = setInterval(() => {
      setCurrentTab((prevTab) => (prevTab % tabCount) + 1); // Cycle tabs
    }, 5000); // Change tab every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [topPicks.length, tabCount]);
  const listingsByTab = Array.from({ length: tabCount }, (_, index) =>
    topPicks.slice(index * 4, index * 4 + 4)
  );
  return (
    <Box>
      <Container>
        {/* Section Title */}
        <Typography variant="h4" sx={{ color: "#007C5F", mb: 1 }}>
          Top picks in each collection
        </Typography>

        <TabContext value={currentTab}>
          <Box>
            <TabList
              onChange={handleTabChange}
              aria-label="lab API tabs example"
            >
              {/* Tabs according to tabCount */}
              {Array.from({ length: tabCount }, (_, index) => (
                <Tab key={index} label={`Tab ${index + 1}`} value={index + 1} />
              ))}
              {/* Static Tab */}
              {/* <Tab label="Item one" value={1} /> */}
            </TabList>
          </Box>
          {/* Render TabPanels for each tab */}
          {listingsByTab.map((listings, index) => (
            <TabPanel key={index} value={index + 1}>
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                {listings.map((listing) => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { likeCount, category, ...filtered } = listing;
                  return (
                    <ListingCard
                      key={listing.id}
                      listing={{ category: category || "", ...filtered }}
                    />
                  );
                })}
              </Stack>
            </TabPanel>
          ))}
        </TabContext>

        {/* Auction Grid (Displays Current Page's Items)
        <Grid container spacing={3}>
          {topPicksData[currentPage].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ boxShadow: 3 }}>
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid> */}
      </Container>
    </Box>
  );
}
