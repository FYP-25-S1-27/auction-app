// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { Container, Typography } from "@mui/material";
// import CategoryBar from "@/libs/components/CategoryBar";
// import CategorySubcategories from "@/libs/components/CategorySubcategories";
// import CategoryListings from "@/libs/components/CategoryListings";

// export default function CategoryPage() {
//   const router = useRouter();
//   const params = useParams();
//   const categorySlug = params.category as string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [categoryData, setCategoryData] = useState<any>(null);

//   useEffect(() => {
//     async function fetchCategoryData() {
//       try {
//         const response = await fetch(`/api/categories/${categorySlug}`);
//         if (!response.ok) throw new Error("Category not found");
//         const data = await response.json();
//         setCategoryData(data);
//       } catch (error) {
//         console.error(error);
//         router.push("/404");
//       }
//     }

//     if (categorySlug) {
//       fetchCategoryData();
//     }
//   });

//   return (
//     <Container sx={{ minHeight: "100vh" }} className="bg-white">
//       <CategoryBar />
//       <div className="container mx-auto p-6">
//         <Typography variant="h4" sx={{ color: "#007C5F", mb: 2 }}>
//           {categoryData?.name || "Loading..."}
//         </Typography>
//         {categoryData?.subcategories && (
//           <CategorySubcategories
//             subcategories={categoryData.subcategories}
//             parentSlug={categorySlug}
//           />
//         )}
//         <CategoryListings listings={categoryData?.listings || []} />
//       </div>
//     </Container>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Typography, CircularProgress, Alert, Box } from "@mui/material";
import CategoryBar from "@/libs/components/CategoryBar";
import CategorySubcategories from "@/libs/components/CategorySubcategories";
import ListingCard from "@/libs/components/listings/ListingCard";
import { listings } from "@/libs/db/schema";
import { InferSelectModel } from "drizzle-orm";

type SelectListing = InferSelectModel<typeof listings>;

interface CategoryData {
  name: string;
  subcategories: string[];
  listings: SelectListing[];
}

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategoryData() {
      try {
        const response = await fetch(`/api/categories/${category}`);
        if (!response.ok) throw new Error("Category not found");
        const data: CategoryData = await response.json();
        setCategoryData(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      fetchCategoryData();
    }
  }, [category]);

  if (loading) {
    return (
      <Container>
        <CircularProgress sx={{ mt: 3 }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ minHeight: "100vh" }} className="bg-white">
      <CategoryBar />
      <div className="container mx-auto p-6">
        <Typography variant="h4" sx={{ color: "#007C5F", mb: 2 }}>
          {categoryData?.name || "Loading..."}
        </Typography>

        {/* Display Subcategories */}
        {categoryData?.subcategories && (
          <CategorySubcategories
            subcategories={categoryData.subcategories}
            parentSlug={category}
          />
        )}

        {/* Display Listings */}
        <Box display="flex" flexWrap="wrap" gap={2} mt={4}>
          {categoryData?.listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </Box>
      </div>
    </Container>
  );
}