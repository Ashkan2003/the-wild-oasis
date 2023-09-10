import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ErrorBoundary } from "react-error-boundary"; //npm i react-error-boundary// for handling errors 
import ErrorFallback from "./ui/ErrorFallback.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary // we use ErrorBoundary for showing the errors in the usescreen and also make a button to when a part of app get out of work the user can go and use the other parts of the app
      FallbackComponent={ErrorFallback} // when a error acure, then render this component
      onReset={() => window.location.replace("/")} // in the FallbackComponent when the error doesing solve then reset and go to the dashbord so the user can use other parts of app
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
