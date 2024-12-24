import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { generateConsistentColor } from "../../utils/randomizer.util";

const MonacoEditor = ({ onChange, language, code, cursors = [] }) => {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const [visibleTooltips, setVisibleTooltips] = useState({}); // Track which tooltips are visible

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
    };

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
        const updatedTooltips = {};
        Object.keys(cursors).forEach((cursor) => {
            updatedTooltips[cursor] = true; // Make tooltip visible
            setTimeout(() => {
                setVisibleTooltips((prev) => {
                    const newTooltips = { ...prev };
                    delete newTooltips[cursor]; // Hide tooltip after 3 seconds
                    return newTooltips;
                });
            }, 2000); // 3 seconds duration
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
        </div>
    );
};

export default MonacoEditor;
