import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { FaPlay, FaSave, FaEraser, FaShare, FaCode, FaJs, FaPython } from "react-icons/fa"; // Example icons from React Icons
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
    isSocketConnected, // Connection status from props
}) => {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const [visibleTooltips, setVisibleTooltips] = useState({});

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
                left: cursorCoords.left + domNode.offsetLeft + 10,
                tooltip: username,
            };
        }
        return null;
    };

    useEffect(() => {
        const updatedTooltips = {};
        Object.keys(cursors).forEach((cursor) => {
            updatedTooltips[cursor] = true;
            setTimeout(() => {
                setVisibleTooltips((prev) => {
                    const newTooltips = { ...prev };
                    delete newTooltips[cursor];
                    return newTooltips;
                });
            }, 2000);
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

                {/* Connection Status */}
                <div
                    style={{
                        color: isSocketConnected ? "#4CAF50" : "#FF4C4C", // Green for connected, red for disconnected
                        fontWeight: "bold",
                        fontSize: "14px",
                    }}
                >
                    {isSocketConnected ? "Connected to server" : "Disconnected"}
                </div>

                {/* Header Actions with Titles */}
                <div style={{ display: "flex", gap: "20px" }}>
                    <div
                        onClick={() => {
                            if (!executing) {
                                onRun();
                            }
                        }}
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
                                backgroundColor: executing ? "#ccc" : "#4CAF50",
                                padding: "5px",
                                transition: "background-color 0.3s",
                                animation: executing ? "spin 1s linear infinite" : "none",
                            }}
                        />
                        <span style={{ marginLeft: "5px", fontSize: "14px" }}>
                            Run
                        </span>
                    </div>
                    <div
                        onClick={() => {
                            if (!saving) {
                                onSave();
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
                                backgroundColor: saving ? "#ccc" : "#4CAF50",
                                padding: "5px",
                                transition: "background-color 0.3s",
                                animation: saving ? "spin 1s linear infinite" : "none",
                            }}
                        />
                        <span style={{ marginLeft: "5px", fontSize: "14px" }}>
                            Save
                        </span>
                    </div>

                    <div onClick={onErase} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                        <FaEraser size={20} title="Erase Code" />
                        <span style={{ marginLeft: "5px", fontSize: "14px" }}>Erase</span>
                    </div>
                    <div onClick={onShare} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                        <FaShare size={20} title="Share Code" />
                        <span style={{ marginLeft: "5px", fontSize: "14px" }}>Share</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flexGrow: 1, display: "flex" }}>
                {/* Sidebar */}
                <div
                    style={{
                        width: "50px",  // Reduced width
                        backgroundColor: "#2C3E50", // Dark background
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "10px 0",
                        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.3)",
                    }}
                >
                    {[
                        { lang: "python", Icon: FaPython },
                        { lang: "javascript", Icon: FaJs },
                    ].map(({ lang, Icon }, index) => (
                        <div
                            key={index}
                            onClick={() => handleLanguageSelect(lang)}
                            style={{
                                width: "40px",  // Reduced icon width
                                height: "40px", // Reduced icon height
                                margin: "10px 0",
                                backgroundColor: language?.toLowerCase() === lang ? "#007BFF" : "transparent", // Blue for active, transparent otherwise
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                boxShadow: language?.toLowerCase() === lang ? "0px 4px 6px rgba(0, 123, 255, 0.5)" : "none", // Add shadow for active icon
                                transition: "background-color 0.3s, box-shadow 0.3s",
                            }}
                        >
                            <Icon
                                size={24}  // Reduced icon size
                                style={{
                                    color: language?.toLowerCase() === lang ? "white" : "gray", // White for active, gray otherwise
                                    transition: "color 0.3s",
                                }}
                            />
                        </div>
                    ))}
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
                            visibleTooltips[cursor] && (
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
