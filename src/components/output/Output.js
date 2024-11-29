import { useEffect } from "react";
import "./Output.scss";

const Output = ({ code }) => {

    useEffect(() => {
        executeCode(code)
    }, [code]);

    // Execute the JavaScript code
    function executeCode(codeString) {
        const outputElement = document.getElementById("output");

        // Clear previous output
        outputElement.innerHTML = '';

        try {
            // Redirect console output to the output div
            const originalLog = console.log;
            console.log = function (...args) {
                const message = args.join(" ");
                const newLine = document.createElement("div");
                newLine.textContent = message; // Ensuring text is safe
                outputElement.appendChild(newLine);
                outputElement.scrollTop = outputElement.scrollHeight;
            };

            // Validate the code before execution
            try {
                // eslint-disable-next-line no-new-func
                new Function(codeString); // This will throw a syntax error if the code is invalid
            } catch (syntaxError) {
                throw new Error(`Syntax Error: ${syntaxError.message}`);
            }

            // Execute the code incrementally
            // eslint-disable-next-line no-new-func
            const execute = new Function(codeString);
            execute();

            // Restore the original console.log
            console.log = originalLog;

        } catch (error) {
            // Handle errors by showing them in red
            const errorMessage = document.createElement("div");
            errorMessage.style.color = "red";
            errorMessage.textContent = `Error: ${error.message}`;
            outputElement.appendChild(errorMessage);
        }
    }
    return (
        <div className="output" id="output">
        </div>
    );
};

export default Output;