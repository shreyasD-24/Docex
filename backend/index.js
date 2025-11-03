import app from "./app.js";
import httpServer from "./socket.js";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

httpServer.listen(3001, () => {
  console.log("Socket server is running on port 3001");
});
