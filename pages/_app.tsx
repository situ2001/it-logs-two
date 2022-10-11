import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }: AppProps) {
  const { session } = pageProps as any;

  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </SessionProvider>
  );
}

export default MyApp;
