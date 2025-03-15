"use client";

import { getAccessToken, useUser } from "@auth0/nextjs-auth0";
import { Button, Container, Link } from "@mui/material";
// import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState<number>(0);
  const [token, setToken] = useState<string>("");
  const auth = useUser();
  if (auth.user) {
    getAccessToken().then((t) => {
      setToken(t);
    });
  }

  return (
    <Container>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div className="flex flex-row gap-4">
            <Link href="/tests/db">Database</Link>
            <Link href="/tests/socketio">Socket.io</Link>
          </div>
          <h1>{"abc.test"}</h1>
          <h2>{count}</h2>
          <Button
            onClick={() => {
              setCount((prev) => prev + 1);
            }}
          >
            Increase count by 1
          </Button>
          <p>
            &apos;use client&apos; is directive used on this page as there is an
            event handler
          </p>
          <p>{token}</p>
          {auth.user ? <p>Nickname: {auth.user.nickname}</p> : null}
          {auth.user ? <p>User: {auth.user.sub}</p> : null}
          <p>
            {auth.user ? `Email: ${auth.user.email}` : "You are not logged in."}
          </p>
          <a href="/auth/login">
            <Button variant="contained">Login / Sign Up</Button>
          </a>
          <a href="/auth/logout">
            <Button variant="contained">Logout</Button>
          </a>
        </main>
      </div>
    </Container>
  );
}
