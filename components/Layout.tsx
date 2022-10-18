import { styled } from "@nextui-org/react";
import Head from "next/head";
import { PropsWithChildren } from "react";
import Header from "./Header";

const Box = styled("div", {
  boxSizing: "border-box",
  maxW: "100%",
});

export function Layout({ children }: PropsWithChildren) {
  return (
    <Box>
      <Header />
      <Head>
        <title>It logs two</title>
      </Head>
      {children}
    </Box>
  );
}
