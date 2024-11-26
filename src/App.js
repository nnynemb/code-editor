import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import "./App.scss";
import RunButton from "./assets/run_button.png";

function App() {
  const [codeString, setCodeString] = React.useState('');
  const [isExecuting, setIsExecuting] = React.useState(false);

  // Handle the code editor change
  const onChange = React.useCallback((value, viewUpdate) => {
    setCodeString(value);
  }, []);

  // Execute the JavaScript code
  function executeCode() {
    const outputElement = document.getElementById("output");
    setIsExecuting(true);
  
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
    } finally {
      // Ensure the executing state is reset
      setIsExecuting(false);
    }
  }

  return (
    <div>
      <div className="editor">
        <CodeMirror
          value={codeString}
          height="100vh"
          theme="dark"
          extensions={[javascript({ jsx: true })]}
          onChange={onChange}
        />
      </div>
      
      {/* Run button */}
        <img
          className="run-button"
          onClick={executeCode}
          src={RunButton}
          alt="run button"
          style={{ cursor: isExecuting ? 'not-allowed' : 'pointer', opacity: isExecuting ? 0.5 : 1 }}
        />

      {/* Output area */}
      <div className="output" id="output">
      </div>
    </div>
  );
}

export default App;
