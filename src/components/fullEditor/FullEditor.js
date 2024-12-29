import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import Editor from "../editor/Editor";
import Output from "../output/Output";
import compilerService from "./../../services/api";
import "./FullEditor.scss";  // Import the SCSS
import { useSocket } from "./../../context/Socket.IO.Context";
import { generateCartoonHeroName } from "../../utils/randomizer.util";
import { v4 as uuidv4 } from 'uuid';
import { debounce } from "lodash";

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
  const [cursors, setCursors] = useState({});
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const leftColumnRef = useRef();
  const rightColumnRef = useRef();
  // const modalRef = useRef();
  const socket = useSocket();

  const [username] = useState(() => generateCartoonHeroName());
  const [sessionIdGenerated] = useState(() => uuidv4());


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

  const streamCode = debounce((changedCode, language, username, sessionIdGenerated, cursorPosition) => {
    const data = {
      code: changedCode || "", language, username,
      userId: sessionIdGenerated,
      cursor: {
        content: `${username} is typing...`,
        position: cursorPosition
      }
    };
    // Emit with a callback for acknowledgment
    socket.emit(sessionId, data);
  }, 1000); // Debounce the function to avoid sending too many events

  const onChange = (changedCode, cursorPosition) => {
    if (!sessionId || !sessionIdGenerated) return;
    if (changedCode === code) return;
    setCode(changedCode || "");
    streamCode(changedCode, language, username, sessionIdGenerated, cursorPosition);
  };



  const sendCodeToExecute = () => {
    executeCode(code, language);
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

  useEffect(() => {
    socket && socket.on('connect', () => {
      setIsSocketConnected(true);
    });
    socket && socket.on('disconnect', () => {
      setIsSocketConnected(false);
    });
  }, [socket]);

  useEffect(() => {
    // Join the room directly after the connection is established
    socket && sessionId && socket.on('connect', () => {
      socket.emit('joinRoom', sessionId); // Join the room after connection
    });

    if (socket && sessionId && socket.connected) {
      setIsSocketConnected(true);
      socket.emit('joinRoom', sessionId); // Join the room after
    }

    // get the code chnage events from the server
    socket && sessionId && socket.on(sessionId, (data) => {
      const channel = data.channel;
      const remotelanguage = data.language;
      const content = data.content;
      const senderSocketId = data.senderSocketId;
      const cursor = data.cursor;
      const userId = data.userId;
      if (userId && sessionIdGenerated && channel === sessionId && senderSocketId !== socket.id && userId !== sessionIdGenerated) {
        // Update the code only if it is different from the current code or empty
        if (content !== code || content === "") setCode(content);
        if (remotelanguage !== language) setLanguage(language);
        if (cursor) {
          setCursors((previousCursors) => {
            const newCursors = { ...previousCursors };
            newCursors[senderSocketId] = data.cursor;
            newCursors[senderSocketId].username = data.username;
            return newCursors;
          });
        }
      }
    });

    // get the output events from the server
    socket && sessionId && socket.on('output', (data) => {
      const { output, sessionId: sid } = data;

      if (sid === sessionId) {
        setOutputText(output);
      }
    });


    // get the command events from the server
    socket && sessionId && socket.on('command', (data) => {
      const { command, sessionId: sid } = data;
      if (sid === sessionId) {
        switch (command) {
          case 'start':
            setOutput("");
            setLoading(true);
            break;
          case 'end':
            setLoading(false);
            break;
          default:
            console.log('Unknown command:', command);
        }
      }
    });


    return () => {
      socket && sessionId && socket.off(sessionId);
      socket && sessionId && socket.off('output');
      socket && sessionId && socket.off('command');
    };

  }, [socket, sessionId, sessionIdGenerated, code, language]);


  function setOutputText(output) {
    setOutput((previousOutput) => {
      // Trim the previous output
      const trimmedOutput = previousOutput.trimEnd();

      // Split the new output by newline, filter out empty lines, and join them back
      const numberedOutput = output
        .split('\n') // Split the output into lines
        .filter((line) => line.trim() !== '') // Omit empty lines
        .join('\n'); // Join the lines back with newline characters

      // Combine with the previous output
      return trimmedOutput
        ? `${trimmedOutput}\n${numberedOutput}`
        : numberedOutput;
    });
  }

  // Execute the code
  async function executeCode(codeString, selectedLanguage) {
    if (codeString && selectedLanguage && sessionId) {
      setLoading(true);
      const response = await compilerService.runCode({ code: codeString, language: selectedLanguage?.toLowerCase(), sessionId });
      const text = await response.text();
      setOutputText(text);
    }
  }

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
      <div className="row g-0">
        <div className="col-8" ref={leftColumnRef}>
          <div className="editor-container">
            <Editor onChange={onChange}
              handleSave={sendCodeToExecute}
              onRun={sendCodeToExecute}
              onSave={saveCodeToDatabase}
              onErase={clearOutput}
              onShare={shareSession}
              setSelectedLanguage={setLanguage}
              executing={loading}
              saving={saving}
              code={code}
              language={language}
              cursors={cursors}
              isSocketConnected={isSocketConnected} />
          </div>
        </div>
        <div className="col-4" ref={rightColumnRef}>
          <div className="output-container">
            <Output output={output} />
          </div>
        </div>
      </div>
    </div>
  );
}
