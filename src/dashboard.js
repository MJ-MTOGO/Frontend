import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import useWebSocket from "./hooks/useWebSocket";

const Dashboard = props => {
  const { loggedIn, email } = props;
  const navigate = useNavigate();
  const WEBSOCKET_DashboardURL = process.env.REACT_APP_WEBSOCKET_DashboardURL;
  const { data, isConnected } = useWebSocket(WEBSOCKET_DashboardURL);
  const user = JSON.parse(localStorage.getItem("user"));
  const [userlogout, setUserlogout] = useState(true);
  const apiDashboardURl = process.env.REACT_APP_apiDashboard;
  const [dashboardData, setDashboardData] = useState({
    TotalPendingOrder: 0,
    TotalReadyToPickupOrder: 0,
    TotalDeliveredOrder: 0,
    TotalMtogoEarning: 0,
    TotalRestaurantEarning: 0,
    TotalAgentEarning: 0,
  });
  const [highlightedFields, setHighlightedFields] = useState([]);

  const logout = () => {
    localStorage.clear();
    setUserlogout(!userlogout);
  };

  useEffect(() => {
    if (data) {
      const updatedFields = [];
      Object.keys(data).forEach(key => {
        if (dashboardData[key] !== data[key]) {
          updatedFields.push(key);
        }
      });
      setHighlightedFields(updatedFields);
      setDashboardData(data);

      // Clear highlights after 1 second
      setTimeout(() => setHighlightedFields([]), 1000);
    }
  }, [data]);

  useEffect(() => {
    if (
      user === null &&
      window.location.pathname !== "/" &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/";
    }
  }, [userlogout]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiDashboardURl}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        console.log(response);
        setDashboardData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mainContainer">
      <button className="logoutButton" onClick={logout}>
        Logout
      </button>

      <div className="dashboardContent">
        <h1>Welcome to the Dashboard!</h1>
        <div className="dashboardStats">
          <h2>Dashboard Summary</h2>
          <p
            className={
              highlightedFields.includes("totalPendingOrder") ? "highlight" : ""
            }>
            Total Pending Orders: {dashboardData.totalPendingOrder}
          </p>
          <p
            className={
              highlightedFields.includes("totalReadyToPickupOrder")
                ? "highlight"
                : ""
            }>
            Total Ready to Pickup Orders:{" "}
            {dashboardData.totalReadyToPickupOrder}
          </p>
          <p
            className={
              highlightedFields.includes("totalDeliveredOrder")
                ? "highlight"
                : ""
            }>
            Total Delivered Orders: {dashboardData.totalDeliveredOrder}
          </p>
          <p
            className={
              highlightedFields.includes("totalMtogoEarning") ? "highlight" : ""
            }>
            Total MTOGO Earnings: DKK {dashboardData.totalMtogoEarning}
          </p>
          <p
            className={
              highlightedFields.includes("totalRestaurantEarning")
                ? "highlight"
                : ""
            }>
            Total Restaurant Earnings: DKK{" "}
            {dashboardData.totalRestaurantEarning}
          </p>
          <p
            className={
              highlightedFields.includes("totalAgentEarning") ? "highlight" : ""
            }>
            Total Agent Earnings: DKK {dashboardData.totalAgentEarning}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
