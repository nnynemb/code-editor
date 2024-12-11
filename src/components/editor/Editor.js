import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import React from "react";
import "./Editor.scss";
import { keymap } from "@codemirror/view";

const languageExtensions = {
    "javascript": javascript({ jsx: true }),
    "python": python(),
    "java": java()
};

const Editor = ({ onChange, language, handleSave, code }) => {
    console.log(language)
    // Handle the code editor change
    const onCodeChange = React.useCallback((value, viewUpdate) => {
        onChange(value, viewUpdate);
    }, []);

    return (
        <div className="editor">
            <CodeMirror
                value={code}
                height="100vh"
                theme="dark"
                extensions={[languageExtensions[language?.toLowerCase() || "javascript"], keymap.of([
                    {
                        key: "Mod-s", // Mod is "Ctrl" on Windows and "Cmd" on Mac
                        run: () => {
                            handleSave();
                            return true; // Prevent default behavior
                        },
                    },
                ])]}
                onChange={onCodeChange}
            />
        </div>
    );
};

export default Editor;