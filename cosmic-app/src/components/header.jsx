import React from "react";
import "./header.css";
import { Link } from "react-router-dom";

export const HeaderNavigation = () => {
  return (
    <nav className="header-nav">
      <Link to="/">
        <h3>Cosmic</h3>
      </Link>
      <ul className="links">
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <a href="#">Settings</a>
        </li>
        <li>
          <Link to="/account">Account</Link>
        </li>
      </ul>
    </nav>
  );
};
