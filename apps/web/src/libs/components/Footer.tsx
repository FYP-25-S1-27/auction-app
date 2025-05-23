import { Container, Divider, Link, Stack, Typography } from "@mui/material";
import Logo from "@public/logo.svg";
import Image from "next/image";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

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
            <Stack direction={"row"} gap={"1rem"}>
              <a
                href="https://www.instagram.com/go_gavel?igsh=MWwzd3NncWw5Y2tydQ=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.youtube.com/@GoGavel-y7c8u"
                target="_blank"
                rel="noopener noreferrer"
              >
                <YouTubeIcon />
              </a>
            </Stack>
            <Typography variant="body2" color="#6F6F6F" mt={2}>
              gogavel.sa.user@gmail.com
            </Typography>
          </Stack>
          <Stack direction="column" maxWidth={250} id="footer-col-2">
            <Typography variant="h6" color="#6F6F6F">
              Buy
            </Typography>
            <Link
              href="https://fyp25s127.wordpress.com/how-to-buy/"
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
              href="https://fyp25s127.wordpress.com/how-to-sell/"
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
