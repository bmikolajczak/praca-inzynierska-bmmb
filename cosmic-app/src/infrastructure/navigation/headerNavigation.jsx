import React from "react";
import "./headerNavigation.css";
import { Link } from "react-router-dom";

export const HeaderNavigation = () => {
  return (
    <nav className="header-nav">
      <Link to="/mars">
        <h3>Cosmic</h3>
      </Link>
      <ul className="links">
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <a href="/settings">Settings</a>
        </li>
        <li>
          <Link to="/account">Account</Link>
        </li>
      </ul>
    </nav>
  );
};
