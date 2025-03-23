import React from "react";
import BeforNav from "./NavBar/BeforNav";
import "./home.css";
function BeforHome() {
  return (
    <div>
      <BeforNav />
      <div className="bkimg">
        <div>
          <div className="dis_div">
            <div>
              <h1 className="welcome_topic">Welcome To Linsa</h1>
              <button
                className="welcome_btn"
                onClick={() => (window.location.href = "/userregister")}
              >
                Get Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeforHome;
