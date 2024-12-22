import "./Output.scss";
import CodeMirror from "@uiw/react-codemirror";

const Output = ({ output }) => {
    const htmlContent = output.replace(/\n/g, "<br>");
    return (
        <div className="output">
            <CodeMirror
                value={output}
                options={{
                    mode: 'text', // Use plain text mode
                    lineNumbers: true, // Enable line numbers if needed
                    readOnly: true, // Make it read-only
                    theme: 'default', // Adjust theme as needed
                }}
            />
        </div>
    );
};

export default Output;