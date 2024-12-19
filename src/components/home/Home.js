import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const CREATE_SESSION = gql`
  mutation GenerateSession($language: String!, $content: String!) {
    generateSession(language: $language, content: $content) {
      id
      language
      content
      createdAt
      updatedAt
    }
  }
`;

function Home() {
  const navigate = useNavigate();
  const [generateSession, { data, error }] = useMutation(CREATE_SESSION);

  const loaderStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  useEffect(() => {
    const createSession = async () => {
      try {
        const { data } = await generateSession({
          variables: {
            language: "JavaScript",
            content: "console.log(`GraphQL with React is powerful!`);",
          },
        });
        if (data?.generateSession?.id) {
          navigate(`/editor/${data.generateSession.id}`);
        }
      } catch (e) {
        console.error("Error creating session:", e.message);
      }
    };

    createSession();
  }, [generateSession, navigate]);

  if (error) {
    return <div>Error: Unable to create a session. Please try again later.</div>;
  }

  return (
    <div style={loaderStyle}>
      <div className="spinner-border m-5" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Home;
