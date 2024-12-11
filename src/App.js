import React from "react";
import "./App.scss";
import FullEditor from "./components/fullEditor/FullEditor";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./components/home/Home";

function App() {

  return (
    <Router>
      <Routes>
        {/* Static Route */}
        <Route path="/" element={<Home />} />

        {/* Dynamic Route */}
        <Route path="/editor/:sessionId" element={<FullEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
