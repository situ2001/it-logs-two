import { Button, Loading } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import { useSlate } from "slate-react";
import { useSWRConfig } from "swr";
import { clearEditor } from "../../lib/editor-helper";

export default function ButtonPost() {
  const editor = useSlate();

  const [posting, setPosting] = useState(false);

  const { mutate } = useSWRConfig();

  const postContent = async () => {
    // console.log(JSON.stringify(editor.children));
    const buf = Buffer.from(JSON.stringify(editor.children));
    const base64Str = buf.toString("base64");
    console.log("About to post", buf.toString("utf8"));

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
  };

  return (
    <Button
      bordered
      color="gradient"
      size={"sm"}
      css={{ minWidth: "72px" }}
      auto
      disabled={posting}
      onClick={postContent}
    >
      {!posting ? (
        "Post"
      ) : (
        <Loading type="spinner" color="currentColor" size="sm" />
      )}
    </Button>
  );
}
