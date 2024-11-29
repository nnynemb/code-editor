import { useEffect, useState } from "react";
import "./LanguageSelector.scss";
const languages = [
    "NodeJS", "Python", "Java"
];
const LanguageSelector = ({onLanguageSelect}) => {
    const [language, selectLanguage] = useState();
    useEffect(()=>{
        onLanguageSelect(language)
    },[language])
    return (
        <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                {language || 'Select language'}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                {
                    languages.map((l,i) => (
                        <li key={i} onClick={()=>{selectLanguage(l.toLowerCase())}}><span className="dropdown-item cursor-pointer">{l}</span></li>
                    ))
                }
            </ul>
        </div>
    );
};

export default LanguageSelector;