import { Editor } from "@monaco-editor/react";
import "./Output.scss";
import { useEffect, useRef } from "react";

const Output = ({ output, onRun, onSave, onShare, onSettings }) => {
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
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div
                style={{
                    backgroundColor: "#282c34",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 20px",
                }}
            >
                {/* Header Title */}
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>Output Viewer</div>

            </div>

            {/* Monaco Editor */}
            <div style={{ flexGrow: 1, position: "relative" }}>
                <Editor
                    height="100%"
                    defaultLanguage="html"
                    value={output}
                    onMount={handleEditorDidMount}
                    options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        readOnly: true,
                    }}
                />
            </div>
        </div>
    );
};

export default Output;
