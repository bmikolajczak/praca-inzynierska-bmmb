import React from "react";
import "./header.css";

export const HeaderNavigation = () => {
  return (
    <nav className="header-nav">
      <a href="#">
        <h3>Cosmic</h3>
      </a>
      <ul className="links">
        <li>
          <a href="#">About</a>
        </li>
        <li>
          <a href="#">Settings</a>
        </li>
        <li>
          <a href="#">Account</a>
        </li>
      </ul>
    </nav>
  );
};
