import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { generateConsistentColor } from "../../utils/randomizer.util";

const MonacoEditor = ({ onChange, language, code, cursors = [] }) => {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const [decorations, setDecorations] = useState([]); // For custom cursors

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
    };

    useEffect(() => {
        if (editorRef.current && code && code !== editorRef.current.getValue()) {
            const editor = editorRef.current;
            editor.setValue(code); // Update code
        }
    }, [code]);

    const onCodeChanged = (changedCode) => {
        const editor = editorRef.current;
        const position = editor.getPosition();
        onChange(changedCode, position);
    };

    const calculateTooltipPosition = (cursor) => {
        const username = cursor.username;
        const position = cursor.position;
        if (!editorRef.current) return null;
        const editor = editorRef.current;
        const domNode = editor.getDomNode();
        const cursorCoords = editor.getScrolledVisiblePosition({
            lineNumber: position.lineNumber,
            column: position.column,
        });

        if (domNode && cursorCoords) {
            return {
                top: cursorCoords.top + domNode.offsetTop,
                left: cursorCoords.left + domNode.offsetLeft + 10, // Offset tooltip slightly
                tooltip: username,
            };
        }
        return null;
    };

    useEffect(() => {
        if (!editorRef.current || !monacoRef.current) return;

        const editor = editorRef.current;
        const monaco = monacoRef.current;

        // Update custom cursors
        const newDecorations = Object.keys(cursors).map((cursor, index) => {
            const content = cursors[cursor];
            const position = content.position;
            return {
                range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                options: {
                    className: "custom-cursor", // Custom class for styling the cursor
                    hoverMessage: { value: content.username }, // Tooltip on hover
                },
            };
        });

        // Apply the custom cursor decorations
        const decorations = editor.deltaDecorations([], newDecorations);
        setDecorations(decorations);
    }, [cursors]);

    return (
        <div style={{ position: "relative", height: "90vh" }}>
            <Editor
                height="90vh"
                defaultLanguage={language?.toLowerCase() || "javascript"}
                value={code}
                onChange={onCodeChanged}
                onMount={handleEditorDidMount}
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                }}
            />

            {/* Tooltips */}
            {Object.keys(cursors).map((cursor, index) => {
                const content = cursors[cursor];
                const position = calculateTooltipPosition(content);
                const backgroundColor = generateConsistentColor(content.username);
                return (
                    position && (
                        <div
                            key={index}
                            style={{
                                position: "absolute",
                                top: position.top,
                                left: position.left,
                                backgroundColor: backgroundColor,
                                color: "white",
                                padding: "5px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                zIndex: 10,
                            }}
                        >
                            {position.tooltip}
                        </div>
                    )
                );
            })}

            {/* Custom cursor styling */}
            <style>
                {`
                    .custom-cursor {
                        position: relative;
                        background-color: red;
                        width: 2px;
                        height: 1em;
                        z-index: 1000;
                    }
                `}
            </style>
        </div>
    );
};

export default MonacoEditor;
