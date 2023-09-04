import React from "react";
import ChatBot from "react-simple-chatbot";
import data from "./steps.json";
import dataSpanish from "./steps-spanish.json";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chatbot from "./components/chatbot";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/1"
          element={<Chatbot steps={data.steps} name={1} />}
        />
        <Route
          exact
          path="/2"
          element={<Chatbot steps={dataSpanish.steps} name={2} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
