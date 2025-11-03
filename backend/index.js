import httpServer from "./socket.js";

const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log("HTTP + Socket server is running on port " + PORT);
});
