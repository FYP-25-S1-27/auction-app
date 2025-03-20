import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/libs/theme";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import NavBar from "@/libs/components/NavBar";
import { auth0 } from "@/libs/auth0";
import { db } from "@/libs/db/drizzle";
import { users } from "@/libs/db/schema";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();
  if (session) {
    // Upsert the user into the database when they log in
    // This is called on every and any page load, but the database will only insert the user if they don't already exist
    const user = session.user;
    if (user) {
      await db
        .insert(users)
        .values({ uuid: user.sub ?? "", username: user.nickname ?? "" })
        .onConflictDoNothing();
    }
  }

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
