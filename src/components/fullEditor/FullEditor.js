import { useState } from "react";
import Editor from "../editor/Editor";
import Output from "../output/Output";
import "./FullEditor.scss";
import LanguageSelector from "../languageSelector/LanguageSelector";

const FullEditor = () => {
    const [code, setCode] = useState('');
    const [codeToCompile, setCodeToCompile] = useState('');
    const [language, setLanguage] = useState('');

    const onChange = (changedCode, view) => {
        setCode(changedCode)
    };

    const sendCodeToExecute = () => {
        setCodeToCompile(code)
    };

    const onLanguageSelect = (l) =>{
        setLanguage(l);
    };

    return (
        <div className="container">
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    <LanguageSelector onLanguageSelect={onLanguageSelect}/>
                    <button className="btn btn-sm btn-primary" onClick={sendCodeToExecute}>Run</button>
                </div>
            </nav>
            <div className="row">
                <div className="col">
                    <Editor onChange={onChange} handleSave={sendCodeToExecute} language={language} />
                </div>
                <div className="col">
                    <Output code={codeToCompile} language={language} />
                </div>
            </div>
        </div>
    );
};

export default FullEditor;