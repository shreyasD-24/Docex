import Editor from "./pages/Editor.jsx";
import { useEffect } from "react";
import socket from "../socket.js";
import JoinRoom from "./pages/JoinRoom";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Routes>
      <Route path="/join-room" element={<JoinRoom socket={socket} />} />
      <Route path="/collab" element={<Editor socket={socket} />} />
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
