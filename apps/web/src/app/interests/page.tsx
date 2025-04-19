"use client";

import { Box, Button, Chip, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ProfileLayout from "@/libs/components/ProfileLayout";

interface Category {
  name: string;
  subcategories: string[];
}
// Static subcategories (predefined)
// const interestsByCategory = {
//   Furniture: [
//     "Antiques", "Ceramics and Glass", "Cooking & Dining", "Home & Garden",
//     "Lighting", "Posters & Wall Decor", "Sculptures & Figurines", "Rugs & Home Textiles",
//   ],
//   Gadgets: [
//     "Smartphones", "Laptops & Tablets", "Gaming Consoles", "Camera & Accessories",
//     "TVs & Home Theatre", "Audio Equipment",
//   ],
//   Sports: [
//     "Fitness Equipment", "Water Sports", "Cycling", "Outdoor Recreation",
//     "Golf Equipment", "Winter Sports",
//   ],
//   Cars: [
//     "Sedan", "SUV", "Truck", "Convertible", "Luxury", "Vintage"
//   ],
//   Alcohol: [
//     "Whiskey", "Vodka", "Rum", "Tequila", "Wine", "Beer", "Liqueurs"
//   ],
//   Jewellery: [
//     "Rings", "Necklaces", "Bracelets", "Earrings", "Brooches"
//   ],
//   Watches: [
//     "Luxury", "Smartwatches", "Digital", "Sport Watches"
//   ],
//   "Event Tickets": [
//     "Concerts", "Sports", "Theater"
//   ],
//   "Toys & Collectibles": [
//     "Action Figures", "LEGO", "Plush Toys", "Board games"
//   ],
//   Art: [
//     "Paintings", "Sculptures", "Canvas Art", "Calligraphy"
//   ]
// };

export default function InterestsPage() {
  const [categories, setCategories] = useState<string[]>([]); // For storing main categories
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    // Fetch main categories from the API
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/category');
        if (response.ok) {
          const data = await response.json();
          setCategories(data); // Set main categories
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleToggle = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = () => {
    const data = {
      interests: selected,
    };
    console.log("Saved Interests:", data);
    // TODO: Replace with API call to save
  };

  const handleCancel = () => {
    setSelected([]);
  };

  return (
    <Box sx={{ padding: "24px", minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <ProfileLayout>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Customize your item recommendations based on your interests
      </Typography>
      <Divider sx={{ mb: 3 }} />
      

      {/* Categories */}
      {categories.map((category) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {category}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {/* Use keyof to ensure category is a valid key of interestsByCategory */}
            {/* {interestsByCategory[category as keyof typeof interestsByCategory]?.map((interest) => (
              <Chip
                key={interest}
                label={interest}
                variant={selected.includes(interest) ? "filled" : "outlined"}
                color={selected.includes(interest) ? "success" : "default"}
                onClick={() => handleToggle(interest)}
                clickable
              />
            ))} */}

            {category.subcategory.map((subcategory) => (
                <Chip
                  key={subcategory}
                  label={subcategory}
                  variant={selected.includes(subcategory) ? "filled" : "outlined"}
                  color={selected.includes(subcategory) ? "success" : "default"}
                  onClick={() => handleToggle(subcategory)}
                  clickable
                />
              ))}
          </Box>
        </Box>
      ))}

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
        <Button variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="success" onClick={handleSave}>
          Save
        </Button>
      </Box>
      </ProfileLayout>
    </Box>
  );
}
