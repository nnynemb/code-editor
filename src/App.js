import React, { useEffect, useState } from "react";
import "./App.scss";
import FullEditor from "./components/fullEditor/FullEditor";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/home/Home";
import { SocketProvider } from "./context/Socket.IO.Context";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import ProtectedComponenet from "./components/protectedComponenet/ProtectedComponent";

function App() {
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  return (
    <SocketProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedComponenet user={user}>
                <Home user={user} />
              </ProtectedComponenet>
            }
          />
          <Route
            path="/editor/:sessionId"
            element={
              <ProtectedComponenet user={user}>
                <FullEditor user={user} />
              </ProtectedComponenet>
            }
          />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
