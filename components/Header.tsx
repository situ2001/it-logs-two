/* eslint-disable react/display-name */
import {
  Avatar,
  Button,
  Container,
  Navbar,
  Link,
  Text,
  Loading,
  Popover,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

export default function Header() {
  const { data: session, status } = useSession();

  const right = useMemo(() => {
    if (status === "loading") {
      return (
        <>
          <Loading type="points-opacity"></Loading>
        </>
      );
    } else if (status === "unauthenticated") {
      return (
        <>
          <Button auto flat as={Link} href="/api/auth/signin">
            <Text>Login</Text>
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Popover placement="bottom-right">
            <Popover.Trigger>
              <Avatar src={session!.user!.image!}></Avatar>
            </Popover.Trigger>
            <Popover.Content>
              <Container css={{ mw: "300px" }}>
                <Text>{session?.user?.name}</Text>
                <Button as={Link} href="/api/auth/signout" size="sm">
                  Logout
                </Button>
              </Container>
            </Popover.Content>
          </Popover>
        </>
      );
    }
  }, [session, status]);

  return (
    <Navbar isBordered variant="floating">
      <Navbar.Brand>
        <Text size="$lg" transform="uppercase">
          It logs two
        </Text>
      </Navbar.Brand>
      {/* <Navbar.Content hideIn="xs">About</Navbar.Content> */}
      <Navbar.Content>
        <Navbar.Item>{right}</Navbar.Item>
      </Navbar.Content>
    </Navbar>
  );
}
