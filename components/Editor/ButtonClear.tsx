import { Button } from "@nextui-org/react";
import { Editor, Transforms } from "slate";
import { useSlate } from "slate-react";
import { clearEditor } from "../../lib/editor-helper";

export default function ButtonClear() {
  const editor = useSlate();

  return (
    <Button
      bordered
      color="error"
      auto
      size={"sm"}
      onPress={() => {
        clearEditor(editor);
      }}
    >
      Clear
    </Button>
  );
}
