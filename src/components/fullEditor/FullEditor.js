import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import Editor from "../editor/Editor";
import Output from "../output/Output";
import LanguageSelector from "../languageSelector/LanguageSelector";
import compilerService from "./../../services/api";
import "./FullEditor.scss";  // Import the SCSS

// GraphQL Queries and Mutations
const GET_SESSION = gql`
  query GetSession($id: ID!) {
    getSession(id: $id) {
      id
      language
      content
    }
  }
`;

const UPDATE_SESSION = gql`
  mutation UpdateSession($id: ID!, $language: String!, $content: String!) {
    updateSession(id: $id, language: $language, content: $content) {
      id
      language
      content
      updatedAt
    }
  }
`;

export default function FullEditor() {
  const { sessionId } = useParams(); // Extract sessionId from URL
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dividerPosition, setDividerPosition] = useState(50); // percentage of column width for divider

  const leftColumnRef = useRef();
  const rightColumnRef = useRef();

  // GraphQL hooks
  const { data, loading: loadingSession, error: sessionError } = useQuery(GET_SESSION, {
    variables: { id: sessionId },
    skip: !sessionId, // Skip query if sessionId is not available
    onCompleted: (data) => {
      setCode(data.getSession.content);
      setLanguage(data.getSession.language);
    },
  });

  const [updateSession, { loading: saving, error: saveError }] = useMutation(UPDATE_SESSION, {
    onError: (err) => {
      console.error("Error updating session:", err.message);
    },
  });

  const onChange = (changedCode) => {
    setCode(changedCode);
  };

  const sendCodeToExecute = () => {
    executeCode(code, language);
  };

  const onLanguageSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  };

  const clearOutput = () => {
    setOutput("");
  };

  const saveCodeToDatabase = () => {
    if (sessionId && language && code) {
      updateSession({
        variables: { id: sessionId, language, content: code },
      });
    }
  };

  // Execute the code
  async function executeCode(codeString, selectedLanguage) {
    if (codeString && selectedLanguage) {
      setLoading(true);
      setOutput("");
      const compiledResponse = await compilerService.runCode({ code: codeString, language: selectedLanguage?.toLowerCase() });
      const reader = compiledResponse.body.getReader();
      reader.read().then(function processText({ done, value }) {
        if (done) {
          setLoading(false);
          return;
        }
        const data = new TextDecoder().decode(value);
        setOutput((previousOutput) => {
          const trimmedOutput = previousOutput.trimEnd();
          return trimmedOutput ? `${trimmedOutput}\n${data}` : data;
        });
        return reader.read().then(processText);
      });
    }
  }

  // Handle the divider drag logic
  const startDrag = (e) => {
    setIsDragging(true);
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  };
  
  const onDrag = (e) => {
    if (!isDragging) return;
    const newDividerPosition = Math.min(Math.max(0, (e.clientX / window.innerWidth) * 100), 100);
    setDividerPosition(newDividerPosition);
  };
  
  const stopDrag = (e) => {
    setIsDragging(false);
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  };

  // Handle the Share Button functionality
  const shareSession = () => {
    const shareLink = `${window.location.href}`;
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        alert("Session link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        alert("Failed to copy link.");
      });
  };

  if (sessionError) {
    return <div>Error loading session: {sessionError.message}</div>;
  }

  if (loadingSession) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border m-5" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="full-editor">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <LanguageSelector onLanguageSelect={onLanguageSelect} language={language} />
          <div className="d-flex">
            <button className="btn btn-primary" type="button" disabled={loading} onClick={sendCodeToExecute}>
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Running
                </span>
              ) : (
                <span>
                  <i className="bi bi-play-fill"></i> Run
                </span>
              )}
            </button>
            <button className="btn btn-success ms-2" type="button" disabled={saving} onClick={saveCodeToDatabase}>
              {saving ? (
                <span>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving
                </span>
              ) : (
                "Save"
              )}
            </button>
            <button className="btn btn-danger ms-2" onClick={clearOutput} disabled={loading}>
              Clear
            </button>
            <button className="btn btn-info ms-2" onClick={shareSession}>
              <i className="bi bi-share"></i> Share
            </button>
          </div>
        </div>
      </nav>

      <div className="content">
        <div className="col" ref={leftColumnRef} style={{ width: `${dividerPosition}%` }}>
          <div className="editor-container">
            <Editor onChange={onChange} handleSave={sendCodeToExecute} code={code} language={language} />
          </div>
        </div>

        <div
          className="divider"
          onMouseDown={startDrag}  // Ensure this is properly set
          style={{ left: `${dividerPosition}%` }}
        />

        <div className="col" ref={rightColumnRef} style={{ width: `${100 - dividerPosition}%` }}>
          <div className="output-container">
            <Output output={output} />
          </div>
        </div>
      </div>
    </div>
  );
}
