const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const cors = require("cors");

// Update CORS to allow your Netlify frontend
app.use(cors({ 
  origin: [
    "https://remoteattendance.netlify.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "*"
  ]
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

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
  if (!fs.existsSync("attendance.csv")) {
    return res.status(404).json({ message: "No attendance records found" });
  }
  const data = fs.readFileSync("attendance.csv", "utf8");
  res.type("text/plain").send(data);
});

// Download attendance as CSV file
app.get("/download-attendance", (req, res) => {
  try {
    const filePath = path.join(process.cwd(), "attendance.csv");
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="attendance.csv"');

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      res.status(500).json({ message: "Error downloading file" });
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Error downloading file" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Access from: http://localhost:${PORT}`);
});