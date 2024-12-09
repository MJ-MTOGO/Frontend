import { useEffect, useState } from "react";

const useWebSocket = webscoketUrl => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  //process.env.REACT_APP_WEBSOCKET_URL
  useEffect(() => {
    // Use WebSocket URL from the environment variable
    const ws = new WebSocket(webscoketUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    ws.onmessage = event => {
      console.log("WebSocket message received:", event.data);
      setData(JSON.parse(event.data)); // Assuming the backend sends JSON
    };

    ws.onerror = error => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, []); // Empty dependency array ensures the WebSocket is set up only once

  return { data, isConnected };
};

export default useWebSocket;
