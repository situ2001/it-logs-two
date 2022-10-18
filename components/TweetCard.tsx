import { Card, Text } from "@nextui-org/react";
import { useEffect, useMemo } from "react";
import { createEditor, Descendant } from "slate";
import { Editable, Slate } from "slate-react";
import { ReturningTweet } from "../types/api";

/**
 * Act as a read-only slate editor
 * @returns
 */
export default function TweetCard(props: { data: ReturningTweet }) {
  const { data } = props;

  const editor = useMemo(() => createEditor(), []);

  const str = useMemo(
    () => Buffer.from(data.content, "base64").toString(),
    [data.content]
  );

  return (
    <Card css={{ my: "$10" }} variant="bordered">
      <Card.Body>
        <Text weight="bold">{data.author.name + ":"} </Text>
        {/* Really hack, should render to JSX soon */}
        <Slate key={str} editor={editor} value={JSON.parse(str)}>
          <Editable readOnly />
        </Slate>
      </Card.Body>
    </Card>
  );
}
