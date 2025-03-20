import { NextResponse } from "next/server";

// Dummy data for categories
const categories: Record<string, any> = {
  cars: {
    name: "Cars",
    subcategories: ["Sedan", "SUV", "Truck", "Convertible"],
    listings: [
      { id: 1, name: "Toyota Corolla", bid: "$15,000", timeLeft: "2 days" },
      { id: 2, name: "Ford Mustang", bid: "$25,000", timeLeft: "5 hours" },
    ],
  },
  alcohol: {
    name: "Alcohol",
    subcategories: ["Whiskey", "Vodka", "Rum", "Tequila"],
    listings: [
      { id: 1, name: "Macallan 18", bid: "$500", timeLeft: "1 day" },
      { id: 2, name: "Grey Goose Vodka", bid: "$100", timeLeft: "3 hours" },
    ],
  },
  sports: {
    name: "Sports",
    subcategories: ["Football", "Basketball", "Tennis"],
    listings: [
      { id: 1, name: "Signed Football", bid: "$1,200", timeLeft: "4 days" },
      { id: 2, name: "Tennis Racket", bid: "$300", timeLeft: "2 hours" },
    ],
  },
  gadgets: {
    name: "Gadgets",
    subcategories: ["Smartphones", "Laptops", "Accessories"],
    listings: [
      { id: 1, name: "iPhone 13 Pro", bid: "$800", timeLeft: "6 days" },
      { id: 2, name: "MacBook Air", bid: "$1,100", timeLeft: "3 days" },
    ],
  },
  jewellery: {
    name: "Jewellery",
    subcategories: ["Rings", "Necklaces", "Bracelets"],
    listings: [
      { id: 1, name: "Diamond Ring", bid: "$5,000", timeLeft: "1 week" },
      { id: 2, name: "Gold Necklace", bid: "$2,500", timeLeft: "4 days" },
    ],
  },
  furniture: {
    name: "Furniture",
    subcategories: ["Antiques", "Chairs", "Tables", "Lighting"],
    listings: [
      { id: 1, name: "Vintage Sofa", bid: "$900", timeLeft: "2 days" },
      { id: 2, name: "Wooden Dining Table", bid: "$1,500", timeLeft: "5 days" },
    ],
  },
  watches: {
    name: "Watches",
    subcategories: ["Luxury", "Smartwatches"],
    listings: [
      { id: 1, name: "Rolex Submariner", bid: "$8,000", timeLeft: "1 day" },
      { id: 2, name: "Apple Watch", bid: "$300", timeLeft: "2 hours" },
    ],
  },
  "event-tickets": {
    name: "Event Tickets",
    subcategories: ["Concerts", "Sports", "Theater"],
    listings: [
      { id: 1, name: "Taylor Swift Concert", bid: "$600", timeLeft: "3 days" },
      { id: 2, name: "NBA Finals", bid: "$2,000", timeLeft: "5 hours" },
    ],
  },
  "toys-collectables": {
    name: "Toys & Collectables",
    subcategories: ["Action Figures", "LEGO"],
    listings: [
      { id: 1, name: "Star Wars Action Figure", bid: "$100", timeLeft: "6 hours" },
      { id: 2, name: "LEGO Millennium Falcon", bid: "$300", timeLeft: "3 days" },
    ],
  },
  art: {
    name: "Art",
    subcategories: ["Paintings", "Sculptures"],
    listings: [
      { id: 1, name: "Van Gogh Painting", bid: "$15,000", timeLeft: "1 week" },
      { id: 2, name: "Modern Sculpture", bid: "$5,500", timeLeft: "4 days" },
    ],
  },
};

// API route handler
export async function GET(
    request: Request,
    { params }: { params?: { category?: string } }
  ) {
    console.log("Received category:", params?.category); // Debugging log
  
    if (!params || !params.category) {
      return NextResponse.json({ error: "Category parameter missing" }, { status: 400 });
    }
  
    const categoryKey = params.category.toLowerCase(); // Ensure case-insensitive matching
  
    if (!categories[categoryKey]) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
  
    return NextResponse.json(categories[categoryKey], { status: 200 });
  }