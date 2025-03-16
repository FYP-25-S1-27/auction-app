import { Container } from "@mui/material";
import CategoryBar from "@/libs/components/CategoryBar";
import Toppicks from "@/libs/components/Toppicks";
import EndingSoon from "@/libs/components/Endingsoon";
import PopularCategories from "@/libs/components/PopularCategories";
import YouMightAlsoLike from "@/libs/components/YouMightAlsoLike";

export default async function LandingPage() {
  return (
    <Container sx={{ minHeight: "100vh" }}>
      <CategoryBar />
      <Toppicks />
      <EndingSoon />
      <PopularCategories />
      <YouMightAlsoLike />
    </Container>
  );
}
