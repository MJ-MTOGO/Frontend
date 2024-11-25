import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
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

  const logout = () => {
    localStorage.clear();
    setUserlogout(!userlogout);
  };

  const rows = [
    { id: 1, name: "pizza", age: 28 },
    { id: 2, name: "cola", age: 34 },
    { id: 3, name: "Alice Johnson", age: 45 },
  ];

  const handleButtonClick = row => {
    alert(`Button clicked for ${row.name}`);
  };
  const viewOrder = row => {
    alert(`Button clicked for ${row.name}`);
    rows.forEach(rows => {
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
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => viewOrder(row)}>
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
      </div>
      <Button style={{ color: "black", fontSize: "18px" }} onClick={logout}>
        Logout
      </Button>
    </div>
  );
};

export default Restaurant;
