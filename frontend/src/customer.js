import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Customer = props => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [userlogout, setUserlogout] = useState(true);

  useEffect(() => {
    if (
      user === null &&
      window.location.pathname !== "/" &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/";
    }
  }, [userlogout]);

  const logout = () => {
    localStorage.clear();
    setUserlogout(!userlogout);
  };
  return (
    <div className="mainContainer">
      <div>Welcome! Customer</div>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Customer;
