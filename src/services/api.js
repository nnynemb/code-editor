import { auth } from "./firebase";

const base_url = process.env.REACT_APP_COMPILER_API;

const getAuthToken = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken(); // Retrieves the current user's auth token
    } else {
      throw new Error("No authenticated user");
    }
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

const addAuthHeader = async () => {
  const token = await getAuthToken();
  console.log("Token:", token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const compilerService = {
  // Run code on the server (POST /run-code)
  runCode: async ({ code, language, sessionId }) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(await addAuthHeader()), // Await here to resolve the Promise
      };

      const response = await fetch(`${base_url}run-code`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ code, language, sessionId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.text(); // Assuming the response is a simple text message
      return data;
    } catch (error) {
      console.error('Error running code:', error);
      throw error;
    }
  },

  // Create a new session (POST /sessions)
  createSession: async ({ language, content }) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(await addAuthHeader()),
      };

      const response = await fetch(`${base_url}sessions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ language, content }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json(); // The created session object
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  },

  // Fetch a session by ID (GET /sessions/:id)
  getSession: async (id) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(await addAuthHeader()),
      };

      const response = await fetch(`${base_url}sessions/${id}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json(); // The session object
      return data;
    } catch (error) {
      console.error('Error fetching session data:', error);
      throw error;
    }
  },

  // Update an existing session (PUT /sessions/:id)
  updateSession: async (id, { language, content }) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(await addAuthHeader()),
      };

      const response = await fetch(`${base_url}sessions/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ language, content }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json(); // The updated session object
      return data;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  },

  // Fetch all sessions with pagination (GET /sessions)
  getSessions: async (page = 1, limit = 10) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(await addAuthHeader()),
      };

      const response = await fetch(`${base_url}sessions?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json(); // Sessions and total count
      return data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  },
};

export default compilerService;
