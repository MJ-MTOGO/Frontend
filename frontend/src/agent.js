import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Agent = props => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [userlogout, setUserlogout] = useState(true);
  const logout = () => {
    localStorage.clear();
    setUserlogout(!userlogout);
  };

  useEffect(() => {
    console.log("kørt");

    console.log(user);
    // If the token/email does not exist, mark the user as logged out
    if (
      user === null &&
      window.location.pathname !== "/" &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/";
    }
  }, [userlogout]);

  return (
    <div className="mainContainer">
      <div>Welcome! Agent</div>
      <Button style={{ color: "black", fontSize: "18px" }} onClick={logout}>
        Logout
      </Button>
    </div>
  );
};

export default Agent;
