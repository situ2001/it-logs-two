import { Button, Loading } from "@nextui-org/react";
import axios from "axios";
import { useCallback, useState } from "react";
import { useSlate } from "slate-react";
import useSWR, { useSWRConfig } from "swr";
import { clearEditor } from "../../lib/editor-helper";

const fetcher = (data: any) => (url: string) =>
  axios.post(url, data).then((res) => res.data);

export default function ButtonPost() {
  const editor = useSlate();

  const [posting, setPosting] = useState(false);

  const { mutate } = useSWRConfig();

  const onPress = useCallback(async () => {
    // console.log(JSON.stringify(editor.children));
    const buf = Buffer.from(JSON.stringify(editor.children));
    const base64Str = buf.toString("base64");

    try {
      setPosting(true);
      await axios.post("/api/tweet", { content: base64Str });
      clearEditor(editor);
      mutate("/api/tweet");
    } catch (e) {
      console.error(e);
    } finally {
      setPosting(false);
    }
  }, [editor, mutate]);

  return (
    <Button
      bordered
      color="gradient"
      size={"sm"}
      css={{ minWidth: "72px" }}
      auto
      disabled={posting}
      onPress={onPress}
    >
      {!posting ? (
        "Post"
      ) : (
        <Loading type="spinner" color="currentColor" size="sm" />
      )}
    </Button>
  );
}
