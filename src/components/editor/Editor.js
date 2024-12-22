import React, { useEffect, useRef } from "react";
import Editor from '@monaco-editor/react';


const MonacoEditor = ({ onChange, language, handleSave, code }) => {
    const editorRef = useRef(null); // Reference to the editor instance
    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    useEffect(() => {
        console.log("Code changed", code);
        if (editorRef.current) {
            const editor = editorRef.current;
            editor.getModel().setValue(code); // Set the new code
          }
    }, [code]);

    return (
        <div style={{ height: "90vh" }}>
            <Editor
                height="90vh"
                defaultLanguage={language?.toLowerCase() || "javascript"}
                defaultValue={code}
                onChange={onChange}
                onMount={handleEditorDidMount}
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                  }}
            />;
        </div>
    );
};

export default MonacoEditor;

