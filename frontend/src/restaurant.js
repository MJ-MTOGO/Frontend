import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
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
  const { data, isConnected } = useWebSocket();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

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
        `http://35.228.217.156/api/orders/pending/1AC2ED88-C5B3-4043-80C3-1CE7A64C3132`
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

  const handleButtonClick = row => {
    alert(`Button clicked for ${row.name}`);
  };
  const viewOrder = row => {
    alert(`Button clicked for ${row.name}`);
    row.forEach(rows => {
      return <div>{rows.name}</div>;
    });
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
                      onClick={() => handleButtonClick(row.id)}>
                      Ready To Pickup
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Button style={{ color: "black", fontSize: "18px" }} onClick={logout}>
        Logout
      </Button>
    </div>
  );
};

export default Restaurant;
