import React from "react";
import data from "./steps.json";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chatbot from "./components/chatbot";

const App = () => {
  return <Chatbot allSteps={data} name={1} />;
};

export default App;
