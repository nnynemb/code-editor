import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { generateConsistentColor } from "../../utils/randomizer.util";

const MonacoEditor = ({ onChange, language, code, cursors = [] }) => {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const [decorations, setDecorations] = useState([]); // For custom cursors
    const [visibleTooltips, setVisibleTooltips] = useState({}); // Track which tooltips are visible

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

        // Manage tooltips visibility
        const updatedTooltips = {};
        Object.keys(cursors).forEach((cursor) => {
            updatedTooltips[cursor] = true; // Show tooltip
            setTimeout(() => {
                setVisibleTooltips((prev) => {
                    const newTooltips = { ...prev };
                    delete newTooltips[cursor];
                    return newTooltips;
                });
            }, 2000); // Hide after 3 seconds
        });
        setVisibleTooltips(updatedTooltips);
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
                    position &&
                    visibleTooltips[cursor] && ( // Show tooltip only if it's visible
                        <div
                            key={index}
                            style={{
                                position: "absolute",
                                top: position.top,
                                left: position.left,
                                backgroundColor: backgroundColor,
                                color: "white",
                                padding: "3px",
                                borderRadius: "4px",
                                fontSize: "14px",
                                zIndex: 10,
                                fontWeight: "bold",
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
