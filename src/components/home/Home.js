import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import compilerService from "./../../services/api";

function Home() {
  const navigate = useNavigate();

  const loaderStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  useEffect(() => {
    const createSession = async () => {
      try {
        const session = await compilerService.createSession({
          language: "JavaScript",
          content: "console.log(`Using APIs with React is powerful!`);",
        });

        if (session?._id) {
          navigate(`/editor/${session._id}`);
        } else {
          throw new Error("Failed to create session");
        }
      } catch (e) {
        console.error("Error creating session:", e.message);
      }
    };

    createSession();
  }, [navigate]);

  return (
    <div style={loaderStyle}>
      <div className="spinner-border m-5" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Home;
