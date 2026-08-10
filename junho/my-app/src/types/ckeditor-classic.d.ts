import type { ContextWatchdog, Editor, EditorWatchdog } from "ckeditor5";
import type { EditorRelaxedConstructor } from "@ckeditor/ckeditor5-integrations-common";

declare module "@ckeditor/ckeditor5-build-classic" {
  const ClassicEditor: EditorRelaxedConstructor<Editor> & {
    EditorWatchdog: typeof EditorWatchdog;
    ContextWatchdog: typeof ContextWatchdog;
  };

  export default ClassicEditor;
}
