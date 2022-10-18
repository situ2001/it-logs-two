import { Button, Card, Col, Row, Spacer } from "@nextui-org/react";
import { KeyboardEventHandler, memo, useCallback, useState } from "react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { Slate, Editable, withReact } from "slate-react";
import ButtonClear from "./ButtonClear";
import ButtonPost from "./ButtonPost";

const initValue: Descendant[] = [
  { type: "paragraph", children: [{ text: "" }] },
];

const AppEditor = () => {
  const [editor] = useState(() => withReact(withHistory(createEditor())));

  const onKeyDownHandler = useCallback<KeyboardEventHandler<HTMLDivElement>>(
    (e) => {},
    []
  );

  return (
    <Slate editor={editor} value={initValue}>
      <Card css={{ p: "$8", my: "$8" }} variant="bordered">
        <Editable
          style={{ overflow: "scroll", height: "100px" }}
          placeholder="Write something here..."
          onKeyDown={onKeyDownHandler}
        />
        <Row justify="flex-end">
          <ButtonClear />
          <Spacer x={0.5}></Spacer>
          <ButtonPost />
        </Row>
      </Card>
    </Slate>
  );
};

export default memo(AppEditor);
