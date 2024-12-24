import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { FaPlay, FaSave, FaEraser, FaShare, FaCog, FaCode, FaJs, FaPython } from "react-icons/fa"; // Example icons from React Icons
import { generateConsistentColor } from "../../utils/randomizer.util";

const MonacoEditorWithSidebarAndHeader = ({
    onChange,
    language = "javascript",
    code,
    cursors = [],
    onRun,
    onSave,
    onShare,
    onErase,
    setSelectedLanguage,
    executing = false,
    saving = false,
}) => {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const [visibleTooltips, setVisibleTooltips] = useState({}); // Track which tooltips are visible

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
        monaco.editor.setTheme("vs-dark");
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

    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
    };

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
                <div style={{ display: "flex", alignItems: "center" }}>
                    <FaCode size={20} style={{ marginRight: "10px" }} />
                    <span style={{ fontSize: "18px", fontWeight: "bold" }}>Nnynemb Editor</span>
                </div>

                {/* Header Actions with Titles */}
                <div style={{ display: "flex", gap: "20px" }}>
                    <div
                        onClick={onRun}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: executing ? "not-allowed" : "pointer",
                            opacity: executing ? 0.5 : 1,
                            transition: "all 0.3s",
                        }}
                    >
                        <FaPlay
                            size={20}
                            title="Run Code"
                            style={{
                                borderRadius: "50%",
                                backgroundColor: executing ? "#ccc" : "#4CAF50", // Green while active, gray while inactive
                                padding: "5px",
                                transition: "background-color 0.3s, transform 0.3s",
                                transform: executing ? "rotate(360deg)" : "none", // Rotating icon when executing
                            }}
                        />
                        <span style={{ marginLeft: "5px", fontSize: "14px" }}>Run</span>
                    </div>
                    <div
                        onClick={() => {
                            if (!saving) {
                                onSave(); // Only trigger save if not executing
                            }
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: saving ? "not-allowed" : "pointer",
                            opacity: saving ? 0.5 : 1,
                            transition: "all 0.3s",
                        }}
                    >
                        <FaSave
                            size={20}
                            title="Save Code"
                            style={{
                                borderRadius: "50%",
                                backgroundColor: saving ? "#ccc" : "#4CAF50", // Green while active, gray while inactive
                                padding: "5px",
                                transition: "background-color 0.3s, transform 0.3s",
                                transform: saving ? "rotate(360deg)" : "none", // Rotating icon when executing
                            }}
                        />
                        <span style={{ marginLeft: "5px", fontSize: "14px" }}>Save</span>
                    </div>

                    <div onClick={onErase} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                        <FaEraser size={20} title="Erase Code" />
                        <span style={{ marginLeft: "5px", fontSize: "14px" }}>Erase</span>
                    </div>
                    <div onClick={onShare} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                        <FaShare size={20} title="Share Code" />
                        <span style={{ marginLeft: "5px", fontSize: "14px" }}>Share</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                        <FaCog size={20} title="Settings" />
                        <span style={{ marginLeft: "5px", fontSize: "14px" }}>Settings</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flexGrow: 1, display: "flex" }}>
                {/* Sidebar */}
                <div
                    style={{
                        width: "50px",
                        backgroundColor: "#333",
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "10px 0",
                    }}
                >
                    {/* Language Selection */}
                    <div
                        onClick={() => handleLanguageSelect("javascript")}
                        style={{
                            margin: "20px 0",
                            cursor: "pointer",
                            color: language?.toLowerCase() === "javascript" ? "#4CAF50" : "white",
                        }}
                    >
                        <FaJs size={20} title="JavaScript" />
                    </div>
                    <div
                        onClick={() => handleLanguageSelect("python")}
                        style={{
                            margin: "20px 0",
                            cursor: "pointer",
                            color: language?.toLowerCase() === "python" ? "#4CAF50" : "white",
                        }}
                    >
                        <FaPython size={20} title="Python" />
                    </div>
                </div>

                {/* Monaco Editor */}
                <div style={{ flexGrow: 1, position: "relative" }}>
                    <Editor
                        height="100%"
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
            </div>
        </div>
    );
};

export default MonacoEditorWithSidebarAndHeader;
