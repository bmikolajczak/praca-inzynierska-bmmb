import React from "react";
import { Outlet } from "react-router-dom";
export function App() {
  return (
    <div>
      <h1>Hello There!</h1>
      <Outlet />
    </div>
  );
}
