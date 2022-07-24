import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./components/HomeScreen";
import { Account } from "./components/accountScreen";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="about" element={<Home />} />
        <Route path="account" element={<Account />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
