import React from "react";
import { Outlet } from "react-router-dom";

import { HeaderNavigation } from "./infrastructure/navigation/headerNavigation";

export function App() {
  return (
    <div>
      <HeaderNavigation />
      <Outlet />
    </div>
  );
}
