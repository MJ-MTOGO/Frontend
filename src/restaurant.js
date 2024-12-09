import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useWebSocket from "./hooks/useWebSocket";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from "@mui/material";

const Restaurant = props => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();
  const [userlogout, setUserlogout] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const websocketURl = process.env.REACT_APP_WEBSOCKET_URL;
  const { data, isConnected } = useWebSocket(websocketURl);
  const [orders, setOrders] = useState([]);
  const apiRestaurantURl = process.env.REACT_APP_LocalapiRestaurantURl;
  const apiOrderURl = process.env.REACT_APP_apiOrderURL;
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [updateOrderList, setUpdateOrderList] = useState(true);
  const handleCloseModal = () => {
    console.log("Ready to Pick Up");
    setIsModalOpen(false);
  };

  useEffect(() => {
    console.log("Vis forbindelse: " + isConnected);
    if (data) {
      // Add the new order to the list
      setOrders(prevOrders => [...prevOrders, data]);
      console.log("----WebSocket er kørt----");
      console.log(data);
      console.log(isConnected);
    }
  }, [data]);
  const removeOrderById = idToRemove => {
    setOrders(prevOrders =>
      prevOrders.filter(order => order.orderId !== idToRemove)
    );
  };
  useEffect(() => {
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

  const logout = () => {
    localStorage.clear();
    setUserlogout(!userlogout);
  };

  const getPendingOrders = async () => {
    console.log("getPendingOrders");
    try {
      setError(""); // Clear previous errors
      const response = await fetch(
        `${apiOrderURl}/api/orders/pending/1AC2ED88-C5B3-4043-80C3-1CE7A64C3132`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      setOrders(data);
    } catch (err) {
      setError(err.message); // Handle errors
    }
  };

  useEffect(() => {
    getPendingOrders();
  }, []);

  const handleButtonClick = async row => {
    console.log(row.orderId);
    console.log(orders);
    let orderId = {
      orderId: row.orderId,
    };
    // send order id ready to pick
    // status 200? dvs ok
    // opdatere din list

    console.log(orderId);

    try {
      const response = await fetch(
        `${apiRestaurantURl}/api/Restaurant/readytopickup`,
        {
          method: "POST", // HTTP method
          headers: {
            "Content-Type": "application/json", // Specify content type
          },
          body: JSON.stringify(orderId), // Convert order object to JSON string
        }
      );
      console.log(orders);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      removeOrderById(orderId.orderId);
      const result = await response.json();
      console.log("Payment successful:", result);
      setUpdateOrderList(!updateOrderList);
    } catch (error) {
      console.error("Error processing ready to pickup:", error);
    }
  };
  const viewOrder = row => {
    setOrderItems(row);
    setIsModalOpen(true);
  };
  return (
    <div className="mainContainer">
      <div style={{ fontSize: "50px" }}>Restaurant Orders</div>

      <div
        style={{
          maxWidth: "80%",
          margin: "0 auto",
          border: "1px solid black",
          maxHeight: "100%",
        }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.totalPrice} DKK</TableCell>
                  <TableCell>{row.orderStatus}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => viewOrder(row.orderItems)}>
                      View Order
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleButtonClick(row)}>
                      Ready To Pickup
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Order Items</h2>
              <ul>
                {orderItems.map((item, index) => (
                  <li key={index}>
                    {item.name} - ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
              <button onClick={handleCloseModal}>Close</button>
            </div>
            <div className="modal-backdrop" onClick={handleCloseModal}></div>
          </div>
        )}

        {/* Modal styling */}
        <style jsx>{`
          .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          .modal-content {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
          }
          button {
            padding: 10px 20px;
            background: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 20px;
          }
          button:hover {
            background: #0056b3;
          }
        `}</style>
      </div>
      <Button style={{ color: "black", fontSize: "18px" }} onClick={logout}>
        Logout
      </Button>
    </div>
  );
};

export default Restaurant;
