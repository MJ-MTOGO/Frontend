import React, { useState, useEffect, Navigate } from "react";
import { useNavigate } from "react-router-dom";

const Login = props => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [returnSecureToken, setReturnSecureToken] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    // Fetch the user email and token from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    // If the token/email does not exist, mark the user as logged out
    if (user !== null && user.token.length > 0) {
      console.log("token -> 0");
      if (user.email === "a@mtogo.dk") {
        navigate("/Agent");
      } else if (user.email === "c@mtogo.dk") {
        console.log("user.email c");
        navigate("/Customer");
      } else if (user.email === "r@mtogo.dk") {
        navigate("/Restaurant");
      } else if (user.email === "d@mtogo.dk") {
        navigate("/Dashboard");
      }
    }

    // If the token exists, verify it with the auth server to see if it is valid
  }, []);
  // Log in a user using email and password
  const logIn = async e => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD244L5BpNgj4QNDtL7q1LH7i5DjswmYpk",
        {
          method: "POST", // Use the POST method
          headers: {
            "Content-Type": "application/json", // Set the content type
          },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }), // Convert data to JSON string
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        localStorage.setItem(
          "user",
          JSON.stringify({ email, token: result.idToken })
        );

        props.setEmail(email);
        props.setLoggedIn(true);
        if (email === "a@mtogo.dk") {
          navigate("/Agent");
        } else if (email === "c@mtogo.dk") {
          navigate("/Customer");
        } else if (email === "r@mtogo.dk") {
          navigate("/Restaurant");
        } else if (email === "d@mtogo.dk") {
          navigate("/Dashboard");
        }
        setResponseMessage(`Success: ${result.message}`);
      } else {
        setResponseMessage(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("An error occurred while submitting the form.");
      window.alert("Wrong email or password");
    }
  };

  return (
    <div className={"mainContainer"}>
      <div className={"titleContainer"}>
        <div>Login nu</div>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          value={email}
          placeholder="Enter your email here"
          onChange={ev => setEmail(ev.target.value)}
          className={"inputBox"}
        />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          value={password}
          type="password"
          placeholder="Enter your password here"
          onChange={ev => setPassword(ev.target.value)}
          className={"inputBox"}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          className={"inputButton"}
          type="button"
          onClick={logIn}
          value={"Log in"}
        />
      </div>
    </div>
  );
};

export default Login;
