import { styled } from "@nextui-org/react";
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
      {children}
    </Box>
  );
}
