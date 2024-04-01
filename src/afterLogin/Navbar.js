// export default Navbar;
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import navStyle from "./navbar.module.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [openNav, setOpenNav] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  let auth = getAuth();

  const toggleNav = () => {
    setOpenNav((openNav) => !openNav);
  };
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setCurrentUserId(user.uid);
    }); // eslint-disable-next-line
  }, []);

  return (
    <nav className={navStyle.navbar}>
      <div className={navStyle.logo}>
        <span>Polls</span>
        <span>X</span>
        <span>treme</span>
        <span style={{ fontSize: "10px", marginLeft: "8px" }}>v_3.24</span>
      </div>
      <div className={openNav ? `${navStyle.activeNav}` : `${navStyle.navs}`}>
        <NavLink
          activeClassName="activeLink"
          to={"/profile/" + currentUserId}
          onClick={toggleNav}
        >
          <span className="material-symbols-outlined">recent_patient</span>
          Profile
        </NavLink>
        <NavLink activeClassName="activeLink" to="/polls" onClick={toggleNav}>
          <span className="material-symbols-outlined">task_alt</span>
          Polls
        </NavLink>
        <NavLink activeClassName="activeLink" to="/ranking" onClick={toggleNav}>
          <span className="material-symbols-outlined">military_tech</span>
          Ranking
        </NavLink>
      </div>
      <div className={navStyle.menu} onClick={toggleNav}>
        <span className="material-symbols-outlined">menu</span>
      </div>
    </nav>
  );
};

export default Navbar;
