import { Container, Divider, Link, Stack, Typography } from "@mui/material";
import Logo from "@public/logo.svg";
import Image from "next/image";
import InstagramIcon from "@mui/icons-material/Instagram";

export default async function Footer() {
  return (
    <Stack direction="column" mt={"2rem"}>
      <Divider />
      <Container>
        <Stack direction="row" gap={"4rem"} marginTop={2} marginBottom={2}>
          <Stack direction="column" maxWidth={250} id="footer-col-1">
            <Image src={Logo} alt="GoGavel logo" width={150} />
            <Typography
              variant="body2"
              color="#6F6F6F"
              marginTop={"1rem"}
              marginBottom={"2rem"}
            >
              Participate in online auctions to discover one-of-a-kind treasures
              and experience the thrill of buying and selling.
            </Typography>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
            </a>
          </Stack>
          <Stack direction="column" maxWidth={250} id="footer-col-2">
            <Typography variant="h6" color="#6F6F6F">
              Buy
            </Typography>
            <Link
              href="#"
              variant="body2"
              color="#6F6F6F"
              underline="hover"
              target="_blank"
              rel="noopener noreferrer"
            >
              How to buy
            </Link>
          </Stack>
          <Stack direction="column" maxWidth={250} id="footer-col-3">
            <Typography variant="h6" color="#6F6F6F">
              Sell
            </Typography>
            <Link
              href="#"
              variant="body2"
              color="#6F6F6F"
              underline="hover"
              target="_blank"
              rel="noopener noreferrer"
            >
              How to sell
            </Link>
          </Stack>
          <Stack direction="column" maxWidth={250} id="footer-col-4">
            <Typography variant="h6" color="#6F6F6F">
              Others
            </Typography>
            <Link
              href="https://fyp25s127.wordpress.com/faq/"
              variant="body2"
              color="#6F6F6F"
              underline="hover"
              target="_blank"
              rel="noopener noreferrer"
            >
              FAQ
            </Link>
          </Stack>
        </Stack>
      </Container>
      <Divider variant="middle" />
      <Container>
        <Typography
          variant="body2"
          marginTop={1}
          marginBottom={2}
          color="#6F6F6F"
        >
          GoGavel © 2025, All Rights Reserved
        </Typography>
      </Container>
    </Stack>
  );
}
