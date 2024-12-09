import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Agent.css"; // Include styles for table and layout
import useWebSocket from "./hooks/useWebSocket"; // Assuming you have a WebSocket hook

const Agent = props => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [order, setOrder] = useState(null);

  const WEBSOCKET_Delivering_URL =
    process.env.REACT_APP_WEBSOCKET_DeliveringURL; // URL for WebSocket
  const { data } = useWebSocket(WEBSOCKET_Delivering_URL);

  useEffect(() => {
    // Set order state when data is received from WebSocket
    if (data) {
      console.log("WebSocket Data Received:", data);
      setOrder(data); // Assuming `data` matches the JSON format for the order
    }
  }, [data]);

  const handleDelivered = async () => {
    if (!order) return;
    try {
      // Clear previous errors
      const response = await fetch(
        `http://localhost:5017/api/OrderDelivering/${order.OrderId}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setOrder(null);
      const data = await response.json();
      console.log(data);
    } catch (err) {}
  };

  return (
    <div className="mainContainer">
      <button className="logoutButton" onClick={() => localStorage.clear()}>
        Logout
      </button>
      <div className="agentContent">
        <h1>Welcome, Agent!</h1>
        {order ? (
          <div className="orderDetails">
            <p>
              <strong>Status:</strong> {order.OrderStatus}
            </p>
            <p>
              <strong>Pickup Address:</strong>{" "}
              {`${order.PickupAdresse.Street}, ${order.PickupAdresse.PostalCode} ${order.PickupAdresse.City}`}
            </p>
            <p>
              <strong>Delivery Address:</strong>{" "}
              {`${order.DeliveryAdresse.Street}, ${order.DeliveryAdresse.PostalCode} ${order.DeliveryAdresse.City}`}
            </p>
            <button className="deliveredButton" onClick={handleDelivered}>
              Mark as Delivered
            </button>
          </div>
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </div>
  );
};

export default Agent;
