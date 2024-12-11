import { useState } from "react";
import Editor from "../editor/Editor";
import Output from "../output/Output";
import "./FullEditor.scss";
import LanguageSelector from "../languageSelector/LanguageSelector";
import compilerService from "./../../services/api";

export default function FullEditor() {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('');
    const [output, setOutput] = useState('')
    const [loading, setLoading] = useState(false);

    const onChange = (changedCode, view) => {
        setCode(changedCode)
    };

    const sendCodeToExecute = () => {
        executeCode(code, language)
    };

    const onLanguageSelect = (l) => {
        setLanguage(l);
    };

    const clearOutput = () => {
        setOutput('');
    };

    // Execute the JavaScript code
    async function executeCode(codeString, language) {
        if (codeString && language) {
            setLoading(true);
            setOutput('');
            const compiledResponse = await compilerService.runCode({ code: codeString, language });
            const reader = compiledResponse.body.getReader();
            reader.read().then(function processText({ done, value }) {
                if (done) {
                    console.log('Stream ended');
                    setLoading(false)
                    return;
                }
                const data = new TextDecoder().decode(value);
                setOutput((previousOutput) => {
                    // Trim the previous output to avoid trailing newlines
                    const trimmedOutput = previousOutput.trimEnd();

                    // If previousOutput is empty, add `d` directly without a newline
                    if (!trimmedOutput) {
                        return data;
                    }

                    // If the last character is not a newline, add `\n` before `d`
                    return `${trimmedOutput}\n${data}`;
                });
                return reader.read().then(processText);
            });
        }
    }

    return (
        <div className="full-editor container-fluid">
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    <LanguageSelector onLanguageSelect={onLanguageSelect} />
                    <button className="btn btn-success" type="button" disabled={loading} onClick={sendCodeToExecute}>
                        {loading ? <span><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Running</span> : <span><i className="bi bi-play-fill"></i> Run</span>}
                    </button>
                    <button className="btn btn-danger" onClick={clearOutput} disabled={loading}>Clear</button>
                </div>
            </nav>
            <div className="row">
                <div className="col">
                    <Editor onChange={onChange} handleSave={sendCodeToExecute} language={language} />
                </div>
                <div className="col">
                    <Output output={output} />
                </div>
            </div>
        </div>
    );
};