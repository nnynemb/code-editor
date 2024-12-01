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
    };

    // Execute the JavaScript code
    async function executeCode(codeString, language) {
        console.log(codeString, language)
        if (codeString && language) {
            // const outputElement = document.getElementById("output");
            // Clear previous output
            // outputElement.innerHTML = '';
            const compiledResponse = await compilerService.runCode({ code: codeString, language });
            console.log(compiledResponse)
            setOutput(compiledResponse.data.output)
        }
    }

    return (
        <div className="container-fluid">
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    <LanguageSelector onLanguageSelect={onLanguageSelect} />
                    <button className="btn btn-sm btn-primary" onClick={sendCodeToExecute}>run</button>
                    <button className="btn btn-sm btn-danger" onClick={clearOutput}>clear</button>
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