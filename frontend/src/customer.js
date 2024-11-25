import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2"; // Import Grid v2
import Paper from "@mui/material/Paper";

const Customer = props => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [userlogout, setUserlogout] = useState(true);
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [clickedRes, setClickedRes] = useState(null);
  const [selectedMenuItems, setSelectedMenuItems] = useState([]);
  const handleSearch = async () => {
    if (!city.trim()) {
      setError("City cannot be empty");
      return;
    }

    try {
      setError(""); // Clear previous errors
      const response = await fetch(
        `http://localhost:5139/api/Restaurant/by-city/${city}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data); // Update result with API data
    } catch (err) {
      setError(err.message); // Handle errors
    }
  };

  useEffect(() => {
    if (
      user === null &&
      window.location.pathname !== "/" &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/";
    }
  }, [userlogout]);

  const handleButtonClickRes = restaurantId => {
    console.log(restaurantId);
    const selectedRestaurant = result.find(
      result => result.restaurantId === restaurantId
    );
    console.log(selectedRestaurant);
    if (selectedRestaurant && selectedRestaurant.menuItems) {
      setClickedRes(selectedRestaurant);
      setSelectedMenuItems(selectedRestaurant.menuItems);
    } else {
      setSelectedMenuItems([]); // No menu items
    }
  };

  const secRes = () => {
    if (result === null) {
      return (
        <div style={{ margin: "20px", textAlign: "center" }}>
          <input
            type="text"
            placeholder="Enter a city"
            value={city}
            onChange={e => setCity(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginRight: "10px",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#007BFF",
              color: "white",
              cursor: "pointer",
            }}>
            Search
          </button>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>
      );
    } else if (clickedRes === null) {
      return (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h3>Restaurants in {city}:</h3>
          <ul>
            {result.map((result, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                {result.name}{" "}
                <button
                  onClick={() => handleButtonClickRes(result.restaurantId)}
                  style={{
                    padding: "5px 10px",
                    fontSize: "14px",
                    borderRadius: "5px",
                    border: "none",
                    backgroundColor: "#28a745",
                    color: "white",
                    cursor: "pointer",
                  }}>
                  Order
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    } else if (clickedRes !== null) {
      return (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h3>{clickedRes.name}:</h3>
          <ul>
            {selectedMenuItems.map((result, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={4}>
                    <Paper>{result.name}</Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper>Price: {result.price}</Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper>
                      {" "}
                      <button
                        onClick={() => handleButtonClickRes(result.id)}
                        style={{
                          padding: "5px 10px",
                          fontSize: "14px",
                          borderRadius: "5px",
                          border: "none",
                          backgroundColor: "#28a745",
                          color: "white",
                          cursor: "pointer",
                        }}>
                        Add to Cart
                      </button>
                    </Paper>
                  </Grid>
                </Grid>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  };

  const logout = () => {
    localStorage.clear();
    setUserlogout(!userlogout);
  };
  return (
    <div className="mainContainer">
      <div style={{ fontSize: "50px" }}>Order</div>
      {secRes()}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Customer;
