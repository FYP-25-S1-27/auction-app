// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { Container, Typography } from "@mui/material";
// import CategoryBar from "@/libs/components/CategoryBar";
// import CategorySubcategories from "@/libs/components/CategorySubcategories";
// import CategoryListings from "@/libs/components/CategoryListings";

// export default function SubcategoryPage() {
//   const router = useRouter();
//   const params = useParams();
//   const categorySlug = params.category as string;
//   const subcategorySlug = params.subcategory as string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [subcategoryData, setSubcategoryData] = useState<any>(null);

//   useEffect(() => {
//     async function fetchSubcategoryData() {
//       try {
//         const response = await fetch(
//           `/api/categories/${categorySlug}/${subcategorySlug}`
//         );
//         if (!response.ok) throw new Error("Subcategory not found");
//         const data = await response.json();
//         setSubcategoryData(data);
//       } catch (error) {
//         console.error(error);
//         router.push("/404");
//       }
//     }

//     if (categorySlug && subcategorySlug) {
//       fetchSubcategoryData();
//     }
//   });

//   return (
//     <Container sx={{ minHeight: "100vh" }} className="bg-white">
//       <CategoryBar />
//       <CategorySubcategories
//         subcategories={[categorySlug]}
//         parentSlug={subcategorySlug}
//       />
//       <Typography variant="h4" sx={{ color: "#007C5F", mb: 2 }}>
//         {subcategoryData?.name || "Loading..."}
//       </Typography>
//       <CategoryListings listings={subcategoryData?.listings || []} />
//     </Container>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Container, Typography, CircularProgress, Alert } from "@mui/material";
import CategoryBar from "@/libs/components/CategoryBar";
import CategoryListings from "@/libs/components/CategoryListings";

interface Listing {
  id: number;
  name: string;
  startingPrice: number;
  currentPrice?: number;
  endTime: string;
}

interface SubcategoryData {
  name: string;
  subcategories: string[];
  listings: Listing[];
}

export default function SubcategoryPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  const { category, subcategory } = useParams<{
    category: string;
    subcategory: string;
  }>();
  const [subcategoryData, setSubcategoryData] =
    useState<SubcategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubcategoryData() {
      try {
        const response = await fetch(
          `/api/categories/${category}/${subcategory}`
        );
        if (!response.ok) throw new Error("Subcategory not found");
        const data: SubcategoryData = await response.json();
        setSubcategoryData(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    if (category && subcategory) {
      fetchSubcategoryData();
    }
  }, [category, subcategory]);

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
      <Typography variant="h4" sx={{ color: "#007C5F", mb: 2 }}>
        {subcategoryData?.name || "Loading..."}
      </Typography>
      <CategoryListings listings={subcategoryData?.listings || []} />
    </Container>
  );
}
