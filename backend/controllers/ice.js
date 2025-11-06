import axios from "axios";
import { config } from "dotenv";

config({
  quiet: true,
});

export async function generateIce(req, res) {
  try {
    if (!process.env.TURNIX_API_KEY) {
      console.error("TURNIX_API_KEY not set in environment");
      return res
        .status(500)
        .json({ error: "TURNIX_API_KEY not configured on server" });
    }

    // axios.post(url, data, config)
    const response = await axios.post(
      "https://turnix.io/api/v1/credentials/ice",
      {
        initiator_client: "User1",
        receiver_client: "User2",
        room: "docx",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TURNIX_API_KEY}`,
          "Content-Type": "application/json",
        },
        params: {
          ttl: 600, // time to live in seconds
        },
      }
    );

    // Return only the iceServers array to the frontend (same shape as before)
    res.status(200).json(response.data.iceServers);
  } catch (error) {
    console.error(
      "Error generating ICE servers:",
      error?.response?.status,
      error?.response?.data || error.message
    );
    const status = error?.response?.status || 500;
    const data = error?.response?.data || {
      error: "Failed to generate ICE servers",
    };
    res.status(status).json(data);
  }
}
