import { Editor } from "@monaco-editor/react";
import "./Output.scss";
import { useEffect, useRef } from "react";

const Output = ({ output }) => {
    const editorRef = useRef(null);
    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    useEffect(() => {
        if (editorRef.current) {
            const editor = editorRef.current;
            editor.getModel().setValue(output);
        }
    }, [output]);
    return (
        <div className="output">
             <Editor 
                height="90vh"
                defaultLanguage="html"
                defaultValue={output}
                onMount={handleEditorDidMount}
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    readOnly: true
                }}
             />
        </div>
    );
};

export default Output;