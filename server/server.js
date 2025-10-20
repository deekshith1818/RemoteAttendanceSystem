// server/server.js
const express = require("express");

const fs = require("fs");
const app = express();

const cors = require("cors");
app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = 5000;

// POST route to mark attendance
app.post("/attendance", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: "Username required" });

  const ip = req.ip.replace("::ffff:", "");
  const timestamp = new Date().toLocaleString();
  const record = `${username},${ip},${timestamp}\n`;

  fs.appendFileSync("attendance.csv", record);
  console.log(`[✔] ${username} marked at ${timestamp}`);

  res.json({ message: "Attendance marked successfully!" });
});

// GET route to view all attendance (for admin)
app.get("/attendance", (req, res) => {
  const data = fs.readFileSync("attendance.csv", "utf8");
  res.type("text/plain").send(data);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Access from LAN: http://<server-ip>:${PORT}`);
});
