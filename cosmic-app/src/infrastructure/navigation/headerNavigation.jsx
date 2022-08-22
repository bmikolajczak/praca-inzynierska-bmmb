import React from "react";
import "./headerNavigation.css";
import { Link } from "react-router-dom";

export const HeaderNavigation = () => {
  return (
    <nav className="header-nav">
      <Link to="/mars">
        Cosmic
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
