import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import Editor from "../editor/Editor";
import Output from "../output/Output";
import "./FullEditor.scss";
import LanguageSelector from "../languageSelector/LanguageSelector";
import compilerService from "./../../services/api";

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
  const [language, setLanguage] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Execute the JavaScript code
  async function executeCode(codeString, selectedLanguage) {
    if (codeString && selectedLanguage) {
      setLoading(true);
      setOutput("");
      const compiledResponse = await compilerService.runCode({ code: codeString, language: selectedLanguage });
      const reader = compiledResponse.body.getReader();
      reader.read().then(function processText({ done, value }) {
        if (done) {
          console.log("Stream ended");
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
    <div className="full-editor container-fluid">
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <LanguageSelector onLanguageSelect={onLanguageSelect} language={language} />
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
          <button
            className="btn btn-success"
            type="button"
            disabled={saving}
            onClick={saveCodeToDatabase}
          >
            {saving ? (
              <span>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving
              </span>
            ) : (
              "Save"
            )}
          </button>
          <button className="btn btn-danger" onClick={clearOutput} disabled={loading}>
            Clear
          </button>
        </div>
      </nav>
      <div className="row">
        <div className="col">
          <Editor onChange={onChange} handleSave={sendCodeToExecute} code={code} language={language} />
        </div>
        <div className="col">
          <Output output={output} />
        </div>
      </div>
    </div>
  );
}
