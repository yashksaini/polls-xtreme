import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import navStyle from "./navbar.module.css";
import { getAuth, signOut } from "firebase/auth";
const AdminNavbar = () => {
  const [openNav, setOpenNav] = useState(false);
  const toggleNav = () => {
    setOpenNav((openNav) => !openNav);
  };
  const signOutUser = async () => {
    const auth = getAuth();
    await signOut(auth).then(() => {
      localStorage.setItem("userType", "");
      window.location.reload();
    });
  };
  return (
    <nav className={navStyle.navbar}>
      <div className={navStyle.logo}>
        <span>Polls</span>
        <span>X</span>
        <span>treme</span>
      </div>
      <div className={openNav ? `${navStyle.activeNav}` : `${navStyle.navs}`}>
        <NavLink onClick={signOutUser} to="/">
          LogOut &nbsp;
          <span className="material-symbols-outlined">logout</span>
        </NavLink>
      </div>
      <div className={navStyle.menu} onClick={toggleNav}>
        <span className="material-symbols-outlined">menu</span>
      </div>
    </nav>
  );
};

export default AdminNavbar;
