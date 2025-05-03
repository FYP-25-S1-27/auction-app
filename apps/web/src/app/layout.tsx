import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/libs/theme";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import NavBar from "@/libs/components/NavBar";
import { Toolbar } from "@mui/material";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "GoGavel",
  description: "Auction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.variable}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Auth0Provider>
              <NavBar />
              <Toolbar />
              {children}
            </Auth0Provider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
