import "./LanguageSelector.scss";
const languages = [
    "javascript", "python"
];
const LanguageSelector = ({onLanguageSelect, language}) => {
    return (
        <div className="dropdown">
            <button className="btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                {language}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                {
                    languages.map((l,i) => (
                        <li key={i} onClick={()=>{onLanguageSelect(l.toLowerCase())}}><span className="btn dropdown-item cursor-pointer">{l}</span></li>
                    ))
                }
            </ul>
        </div>
    );
};

export default LanguageSelector;