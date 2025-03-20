"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Container, Typography } from "@mui/material";
import CategoryBar from "@/libs/components/CategoryBar";
import CategorySubcategories from "@/libs/components/CategorySubcategories";
import CategoryListings from "@/libs/components/CategoryListings";

export default function SubcategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categorySlug = params.category as string;
  const subcategorySlug = params.subcategory as string;
  const [subcategoryData, setSubcategoryData] = useState<any>(null);

  useEffect(() => {
    async function fetchSubcategoryData() {
      try {
        const response = await fetch(`/api/categories/${categorySlug}/${subcategorySlug}`);
        if (!response.ok) throw new Error("Subcategory not found");
        const data = await response.json();
        setSubcategoryData(data);
      } catch (error) {
        console.error(error);
        router.push("/404");
      }
    }

    if (categorySlug && subcategorySlug) {
      fetchSubcategoryData();
    }
  }, [categorySlug, subcategorySlug]);

  return (
    <Container sx={{ minHeight: "100vh" }} className="bg-white">
      <CategoryBar />
      <CategorySubcategories category={categorySlug} selectedSubcategory={subcategorySlug} />
      <Typography variant="h4" 
      sx={{ color: "#007C5F", mb: 2 }}>
        {subcategoryData?.name || "Loading..."}
      </Typography>
      <CategoryListings listings={subcategoryData?.listings || []} />
    </Container>
  );
}
