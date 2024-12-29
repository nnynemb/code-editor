import React from "react";
import "./App.scss";
import FullEditor from "./components/fullEditor/FullEditor";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./components/home/Home";
import { SocketProvider } from "./context/Socket.IO.Context";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <SocketProvider>
      <Router>
        <Routes>
          {/* Static Route */}
          <Route path="/" element={<Home />} />
          {/* Dynamic Route */}
          <Route path="/editor/:sessionId" element={<FullEditor />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
