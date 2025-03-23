import React from "react";
import Logo from "../img/logo.webp";
import "./nav.css";
function BeforNav() {
  const notcompleate = () => { // Add arrow function syntax
    alert("This Page Under Construction");
  };
  return (
    <div>
      <div className="nav_con_user">
        <div>
          <img src={Logo} alt="logo_nav" className="nav_logo_user" />
        </div>
        <div className="nav_item_user">
          <h3 className="navitem" >Home</h3>
          <h3 className="navitem" onClick={notcompleate}>About</h3>
          <h3 className="navitem" onClick={notcompleate}>Contact Us</h3>
          <button
            className="nav_btn_log"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </button>
          <button
            className="nav_btn_regi"
            onClick={() => (window.location.href = "/userregister")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default BeforNav;
