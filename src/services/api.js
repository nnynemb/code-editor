const base_url = process.env.REACT_APP_COMPILER_API;

const compilerService = {
  // Run code on the server (POST /run-code)
  runCode: async ({ code, language, sessionId }) => {
    try {
      const response = await fetch(`${base_url}run-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, sessionId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }


      const data = await response.text(); // Assuming the response is a simple text message
      console.log(data);
      return data; // Returning the response text (confirmation of queued task)
    } catch (error) {
      console.error('Error running code:', error);
      throw error; // Propagate the error to be handled elsewhere
    }
  },

  // Create a new session (POST /sessions)
  createSession: async ({ language, content }) => {
    try {
      const response = await fetch(`${base_url}sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, content }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json(); // The created session object
      return data; // Return the session object
    } catch (error) {
      console.error('Error creating session:', error);
      throw error; // Propagate the error to be handled elsewhere
    }
  },

  // Fetch a session by ID (GET /sessions/:id)
  getSession: async (id) => {
    try {
      const response = await fetch(`${base_url}sessions/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json(); // The session object
      return data; // Return the session object
    } catch (error) {
      console.error('Error fetching session data:', error);
      throw error; // Propagate the error to be handled elsewhere
    }
  },

  // Update an existing session (PUT /sessions/:id)
  updateSession: async (id, { language, content }) => {
    try {
      const response = await fetch(`${base_url}sessions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, content }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json(); // The updated session object
      return data; // Return the updated session
    } catch (error) {
      console.error('Error updating session:', error);
      throw error; // Propagate the error to be handled elsewhere
    }
  },

  // Fetch all sessions with pagination (GET /sessions)
  getSessions: async (page = 1, limit = 10) => {
    try {
      const response = await fetch(`${base_url}sessions?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json(); // Sessions and total count
      return data; // Return the sessions data
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error; // Propagate the error to be handled elsewhere
    }
  }
};

export default compilerService;
