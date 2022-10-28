import type { NextPage } from "next";
import axios from "axios";
import { Card, Container, Text } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import useSWR from "swr";
import AppEditor from "../components/Editor/Editor";
import TweetCard from "../components/TweetCard";
import { ReturningTweet } from "../types/api";

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
        return (
          <>
            <AppEditor />
            {data.map((t: ReturningTweet, i: number) => (
              <TweetCard key={t.id} data={t} />
            ))}
          </>
        );
      } else {
        <Text>Loading...</Text>;
      }
    }
  }, [status, data]);

  return (
    <Layout>
      <Container sm>{content}</Container>
    </Layout>
  );
};

export default Home;
