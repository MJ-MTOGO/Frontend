import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./home";
import Restaurant from "./restaurant";
import Customer from "./customer";
import Dashboard from "./dashboard";
import Agent from "./agent";
import Login from "./login";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

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
  }, [user]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                email={email}
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
              />
            }
          />

          <Route
            path="/Restaurant"
            element={
              <Restaurant
                email={email}
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
              />
            }
          />
          <Route
            path="/Customer"
            element={
              <Customer
                email={email}
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
              />
            }
          />
          <Route
            path="/Agent"
            element={
              <Agent
                email={email}
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
              />
            }
          />
          <Route
            path="/Dashboard"
            element={
              <Dashboard
                email={email}
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
              />
            }
          />
          <Route
            path="/login"
            element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
