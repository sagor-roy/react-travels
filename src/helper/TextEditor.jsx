import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

export default function TextEditor() {
    return (
        <CKEditor
            editor={ClassicEditor}
            onChange={(event, editor) => {
                const data = editor.getData();
                editor.ui.view.editable.editableElement.style.height = '3000px';

                console.log({ event, editor, data });
            }}
        />
    );
}
