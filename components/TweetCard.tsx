import {
  Avatar,
  Button,
  Card,
  Popover,
  Row,
  Spacer,
  Text,
  Tooltip,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { createEditor, Descendant } from "slate";
import { Editable, Slate } from "slate-react";
import { ChatBubbleIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import { ReturningTweet } from "../types/api";
import DeleteTweet from "./DeleteTweet";
import { useSession } from "next-auth/react";
import { getFormattedTimeDuration } from "../lib/date-util";

/**
 * Act as a read-only slate editor
 * @returns
 */
export default function TweetCard(props: { data: ReturningTweet }) {
  const { data } = props;

  const { data: sessionData } = useSession();

  const editor = useMemo(() => createEditor(), []);
  const [showDiffTime, setShowDiffTime] = useState(true);

  const str = useMemo(
    () => Buffer.from(data.content, "base64").toString(),
    [data.content]
  );

  return (
    <Card css={{ my: "$10" }} variant="bordered">
      <Card.Body>
        <Row align="center" css={{ mb: "$4" }}>
          <Avatar css={{ mr: "$2" }} src={data.author.image!}></Avatar>
          <Text weight="bold">{data.author.name}</Text>
          {data.author.email === sessionData?.user?.email && (
            <Row justify="flex-end">
              <Tooltip
                content="Edit is not available now"
                rounded
                color="warning"
              >
                <Button size="sm" color="primary" auto disabled>
                  <Pencil2Icon />
                </Button>
              </Tooltip>
              <Spacer x={0.25} />
              <DeleteTweet id={data.id} />
            </Row>
          )}
        </Row>
        <Row>
          {/* Really hack, should render to JSX soon */}
          <Slate key={str} editor={editor} value={JSON.parse(str)}>
            <Editable readOnly />
          </Slate>
        </Row>
        <Row css={{ mt: "$4" }} align="center">
          <Text
            size="$xs"
            css={{ opacity: "0.6", cursor: "pointer", minWidth: 'fit-content' }}
            onClick={() => {
              setShowDiffTime(!showDiffTime);
            }}
            
          >
            {showDiffTime ? (
              <>{getFormattedTimeDuration(data.createAt)}</>
            ) : (
              <>Post on {dayjs(data.createAt).format("YYYY-MM-DD HH:mm")}</>
            )}
          </Text>
          <Row justify="flex-end">
            <Tooltip
              content="Discussion is not available now"
              rounded
              color="warning"
            >
              <Button size={"sm"} auto disabled>
                <ChatBubbleIcon />
              </Button>
            </Tooltip>
          </Row>
        </Row>
      </Card.Body>
    </Card>
  );
}
