import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Grid from "@mui/material/Grid2"; // Import Grid v2
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
  const apiRestaurantURl = process.env.REACT_APP_LocalapiRestaurantURl;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiOrderURl = process.env.REACT_APP_apiOrderURL;
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const paymentOrder = {
    orderId: "12345",
    amount: 100.0,
    paymentMethod: "CreditCard",
  };
  const defaultOrder = {
    customerId: "",
    restaurantId: "",
    orderItems: [],
    street: "",
    city: "",
    postalCode: "",
  };
  const [createNewOrder, setCreateNewOrder] = useState({ ...defaultOrder });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setCreateNewOrder(prevOrder => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handlePayNow = async () => {
    setIsLoading(true); // Start loading

    try {
      const response = await fetch(`${apiOrderURl}/api/Payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify content type
        },
        body: JSON.stringify(paymentOrder), // Convert order object to JSON string
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setIsLoading(false);
      setPaymentSuccess(true); // Show success message
      console.log(createNewOrder);
      try {
        const response = await fetch(`${apiOrderURl}/api/orders`, {
          method: "POST", // HTTP method
          headers: {
            "Content-Type": "application/json", // Specify content type
          },
          body: JSON.stringify(createNewOrder), // Convert order object to JSON string
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setPaymentSuccess(false);
        setIsModalOpen(false); // Close modal
        setCreateNewOrder({ ...defaultOrder });
        setResult(null);
        setClickedRes(null);
        console.log("Payment successful:", result);
      } catch (error) {
        console.error("Error processing payment:", error);
      }
      console.log("Payment successful:", result);
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };
  const handleSearch = async () => {
    if (!city.trim()) {
      setError("City cannot be empty");
      return;
    }

    try {
      console.log(city);
      console.log(apiRestaurantURl);
      setError(""); // Clear previous errors
      const response = await fetch(
        `${apiRestaurantURl}/api/Restaurant/by-city/${city}`
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

  const handleChooseArestaurantClickRes = restaurantId => {
    const selectedRestaurant = result.find(
      result => result.restaurantId === restaurantId
    );
    console.log(selectedRestaurant);
    if (selectedRestaurant && selectedRestaurant.menuItems) {
      setClickedRes(selectedRestaurant);
      setCreateNewOrder(prevOrder => ({
        ...prevOrder, // Spread existing order details
        restaurantId: selectedRestaurant.restaurantId, // Update restaurantId
        customerId: "a4b1c2d3-e5f6-7890-abcd-1234567890ab", // Update customerId
      }));
      setSelectedMenuItems(selectedRestaurant.menuItems);
    } else {
      setSelectedMenuItems([]); // No menu items
    }
  };

  const handleAddToCart = item => {
    console.log(item);
    setCreateNewOrder(prevOrder => ({
      ...prevOrder,
      orderItems: [
        ...prevOrder.orderItems,
        { name: item.name, price: item.price },
      ],
    }));
  };
  const handleAddress = item => {};

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
                  onClick={() =>
                    handleChooseArestaurantClickRes(result.restaurantId)
                  }
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
          <div></div>
          <h3>{clickedRes.name}:</h3>
          <ul>
            {selectedMenuItems.map((result, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <div container spacing={2}>
                  <div item xs={12} md={4}>
                    <Paper>{result.name}</Paper>
                  </div>
                  <div item xs={12} md={4}>
                    <Paper>Price: {result.price}</Paper>
                  </div>
                  <div item xs={12} md={4}>
                    <Paper>
                      {" "}
                      <button
                        onClick={() => handleAddToCart(result)}
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
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div>
            <p2>Cart</p2>
            <ul>
              {createNewOrder.orderItems.map((result, index) => (
                <li key={index} style={{ marginBottom: "10px" }}>
                  <div container spacing={2}>
                    <div item xs={12} md={4}>
                      <Paper>{result.name}</Paper>
                    </div>
                    <div item xs={12} md={4}>
                      <Paper>Price: {result.price}</Paper>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{ marginBottom: "20px" }}>
              Order now
            </button>
          </div>
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
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Enter Your Address</h2>
            {isLoading ? (
              <div style={styles.loadingContainer}>
                <p>Processing Payment...</p>
              </div>
            ) : paymentSuccess ? (
              <div style={styles.successContainer}>
                <p>Payment went through successfully! 🎉</p>
              </div>
            ) : (
              <>
                <label>
                  Street:
                  <input
                    type="text"
                    name="street"
                    value={createNewOrder.street}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </label>
                <label>
                  City:
                  <input
                    type="text"
                    name="city"
                    value={createNewOrder.city}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </label>
                <label>
                  Postal Code:
                  <input
                    type="text"
                    name="postalCode"
                    value={createNewOrder.postalCode}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </label>
                <button onClick={handlePayNow} style={styles.button}>
                  Pay Now
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={styles.closeButton}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

// Basic styles
const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
    textAlign: "center",
  },
  input: {
    width: "90%",
    padding: "8px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 15px",
    margin: "10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  closeButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  loadingContainer: {
    fontSize: "16px",
    color: "#555",
  },
  successContainer: {
    fontSize: "16px",
    color: "green",
  },
};

export default Customer;
