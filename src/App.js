import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

function App() {
  const onChange = React.useCallback((value, viewUpdate) => {
    console.log("value:", value);
  }, []);
  return (
    <div>
      <CodeMirror
        value="console.log('hello world!');"
        height="100vh"
        theme="dark"
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
      />
    </div>
  );
}

export default App;
