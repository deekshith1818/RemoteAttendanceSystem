const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const cors = require("cors");

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

// Helper function to get client IP
function getClientIP(req) {
  let ip = req.ip || req.connection.remoteAddress || '';
  
  if (ip.includes('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  } else if (ip === '::1') {
    ip = 'localhost';
  }
  
  return ip || 'Unknown';
}

// Helper function to get IST time
function getISTTime() {
  const now = new Date();
  
  // Get UTC time and add 5:30 hours for IST
  const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
  
  const date = String(istTime.getDate()).padStart(2, '0');
  const month = String(istTime.getMonth() + 1).padStart(2, '0');
  const year = istTime.getFullYear();
  
  const hours = String(istTime.getHours()).padStart(2, '0');
  const minutes = String(istTime.getMinutes()).padStart(2, '0');
  const seconds = String(istTime.getSeconds()).padStart(2, '0');
  
  return `${date}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

// POST route to mark attendance
app.post("/attendance", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: "Username required" });

  const ip = getClientIP(req);
  const timestamp = getISTTime();
  
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