import { BaseEditor, Editor, Transforms } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

export const clearEditor = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
  const point = { path: [0, 0], offset: 0 };
  editor.selection = { anchor: point, focus: point }; // clean up selection
  editor.history = { redos: [], undos: [] }; // clean up history
  Transforms.delete(editor, {
    at: {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    },
  });
};
