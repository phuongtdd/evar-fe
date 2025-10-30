import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { QuizProvider } from "./pages/createExam-AI/context/QuizContext";

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <BrowserRouter>
      <QuizProvider>
        <App />
      </QuizProvider>
      </BrowserRouter>
    </StrictMode>
  );
} else {
  console.error("Root element not found");
}
