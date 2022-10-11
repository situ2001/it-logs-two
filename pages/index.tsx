import type { NextPage } from "next";
import axios from "axios";
import { Card, Container, Text } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { Layout } from "../components/Layout";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Home: NextPage = () => {
  const { status } = useSession();

  const { data } = useSWR("/api/tweet", fetcher);

  const content = useMemo(() => {
    if (status === "unauthenticated") {
      return (
        <>
          <Text>Please login first</Text>
        </>
      );
    } else if (status === "loading") {
      return <></>;
    } else {
      if (data) {
        return data.map((t: any, i: number) => {
          return (
            <Card key={i} css={{ my: "$10" }}>
              <Card.Body>
                <Text weight="bold">{t.author.name}: </Text>
                <Text>{Buffer.from(t.content, "base64").toString()}</Text>
              </Card.Body>
            </Card>
          );
        });
      } else {
        <Text>Loading...</Text>;
      }
    }
  }, [status, data]);

  return (
    <Layout>
      <Container>{content}</Container>
    </Layout>
  );
};

export default Home;
