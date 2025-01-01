import { Editor } from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";
import "./Output.scss";
import { signOut, auth } from "../../services/firebase";

const Output = ({ output, user }) => {
    const editorRef = useRef(null);
    const [showLogout, setShowLogout] = useState(false);

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    useEffect(() => {
        if (editorRef.current) {
            const editor = editorRef.current;
            editor.getModel().setValue(output);
        }
    }, [output]);

    const toggleLogoutMenu = () => {
        setShowLogout((prev) => !prev);
    };

    const handleLogout = () => {
        setShowLogout(false);
        signOut(auth);
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
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>Output Viewer</div>
                <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                        style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "10px" }}
                        onClick={toggleLogoutMenu}
                    >
                        <img
                            src={user?.photoURL}
                            alt="User Avatar"
                            className="rounded-circle"
                            style={{ width: "30px", height: "30px" }}
                        />
                        <p className="fw-bold" style={{ fontSize: "14px", margin: 0 }}>
                            {user?.displayName}
                        </p>
                    </div>
                    {showLogout && (
                        <div
                            style={{
                                position: "absolute",
                                top: "40px",
                                right: "0",
                                backgroundColor: "white",
                                color: "black",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                borderRadius: "4px",
                                zIndex: 10,
                            }}
                        >
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: "8px 16px",
                                    border: "none",
                                    backgroundColor: "transparent",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    width: "100%",
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
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
