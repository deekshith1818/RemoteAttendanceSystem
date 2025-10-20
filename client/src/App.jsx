import React, { useState, useEffect } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(new Date());
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setStatus(null);
    setMessage("");

    try {
      // Send request to backend
      const backendURL = "https://remoteattendancesystem.onrender.com";
      const response = await fetch(`${backendURL}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark attendance");
      }

      const data = await response.json();
      setMessage(data.message || `✓ Attendance marked for ${username}`);
      setStatus("success");
      setAttendanceCount((prev) => prev + 1);
      setUsername("");

      setTimeout(() => {
        setStatus(null);
        setMessage("");
      }, 4000);
    } catch (error) {
      setMessage(error.message || "Error marking attendance!");
      setStatus("error");
      console.error("Error:", error);
      setTimeout(() => {
        setStatus(null);
        setMessage("");
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      margin: 0,
      padding: 0,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      alignItems: "center",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: "fixed",
      top: 0,
      left: 0,
      overflow: "hidden",
    }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input:focus {
          border-color: #764ba2 !important;
          box-shadow: 0 0 0 3px rgba(118, 75, 162, 0.1) !important;
        }
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4) !important;
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @media (max-width: 1024px) {
          div[data-layout="grid"] {
            grid-template-columns: 1fr !important;
            padding: 20px !important;
          }
          div[data-layout="card"] {
            max-width: 100% !important;
          }
        }
      `}</style>

      {/* Background Animations */}
      <div style={{
        position: "absolute",
        top: "80px",
        left: "80px",
        width: "280px",
        height: "280px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "50%",
        filter: "blur(120px)",
        animation: "pulse 8s ease-in-out infinite",
      }}></div>

      <div style={{
        position: "absolute",
        bottom: "80px",
        right: "80px",
        width: "280px",
        height: "280px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "50%",
        filter: "blur(120px)",
        animation: "pulse 8s ease-in-out 2s infinite",
      }}></div>

      {/* Center Section - Card */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gridColumn: "1 / -1",
      }} data-layout="grid">
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          padding: "40px",
          width: "100%",
          maxWidth: "450px",
        }} data-layout="card">

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div style={{
              display: "inline-block",
              padding: "16px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              borderRadius: "50%",
              marginBottom: "16px",
              animation: "bounce 2s infinite",
            }}>
              <svg style={{ width: "32px", height: "32px", color: "white" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 style={{
              fontSize: "32px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: "16px 0",
            }}>Attendance System</h1>
            <p style={{ color: "#666", fontSize: "14px", marginTop: "8px" }}>{formatDate(time)}</p>
            <p style={{ fontSize: "28px", fontWeight: "bold", color: "#764ba2", fontFamily: "monospace", marginTop: "8px" }}>{formatTime(time)}</p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              textAlign: "center",
            }}>
              <p style={{ color: "#666", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px" }}>Marked Today</p>
              <p style={{ fontSize: "36px", fontWeight: "700", color: "#10b981" }}>{attendanceCount}</p>
            </div>
            <div style={{
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              textAlign: "center",
            }}>
              <p style={{ color: "#666", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px" }}>Status</p>
              <p style={{ fontSize: "36px", fontWeight: "700", color: "#0891b2" }}>✓</p>
            </div>
          </div>

          {/* Form */}
          <div>
            <input
              type="text"
              placeholder="Enter your name or roll number"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "2px solid #e5e7eb",
                fontSize: "16px",
                marginBottom: "16px",
                boxSizing: "border-box",
                transition: "all 0.3s",
                outline: "none",
              }}
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !username.trim()}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
              }}
            >
              {loading ? (
                <>
                  <span style={{ animation: "spin 1s linear infinite" }}>⟳</span>
                  Processing...
                </>
              ) : (
                <>
                  <span>✓</span>
                  Mark Attendance
                </>
              )}
            </button>
          </div>

          {/* Status Message */}
          {message && (
            <div style={{
              padding: "16px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              marginTop: "16px",
              animation: "slideIn 0.3s ease-out",
              background: status === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
              border: `1px solid ${status === "success" ? "#10b981" : "#ef4444"}`,
              color: status === "success" ? "#065f46" : "#7f1d1d",
            }}>
              <span style={{ fontSize: "18px", marginTop: "2px" }}>
                {status === "success" ? "✓" : "✕"}
              </span>
              <p style={{ margin: 0, fontSize: "14px" }}>{message}</p>
            </div>
          )}

          {/* History Toggle */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              width: "100%",
              padding: "10px",
              color: "#764ba2",
              fontWeight: "600",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s",
              borderRadius: "8px",
              marginTop: "16px",
            }}
            onMouseOver={(e) => (e.target.style.background = "rgba(118, 75, 162, 0.1)")}
            onMouseOut={(e) => (e.target.style.background = "transparent")}
          >
            {showHistory ? "⊕ Hide" : "⊕ View"} Quick History
          </button>

          {/* History Preview */}
          {showHistory && (
            <div style={{
              background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
              borderRadius: "12px",
              padding: "16px",
              maxHeight: "160px",
              overflowY: "auto",
              marginTop: "16px",
            }}>
              <p style={{ fontSize: "12px", fontWeight: "600", color: "#666", textTransform: "uppercase", marginBottom: "8px" }}>Recent Entries</p>
              {attendanceCount > 0 ? (
                <div>
                  {[...Array(Math.min(attendanceCount, 3))].map((_, i) => (
                    <div key={i} style={{ fontSize: "13px", color: "#374151", display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <div style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "50%", flexShrink: 0 }}></div>
                      Attendance #{attendanceCount - i}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "12px", color: "#999", fontStyle: "italic", margin: 0 }}>No entries yet</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Download Button */}
      <div style={{
        position: "absolute",
        bottom: "80px",
        left: "50%",
        transform: "translateX(-50%)",
      }}>
        <button
          onClick={() => {
            const backendURL = "https://remote-attendance-backend.onrender.com";
            const downloadURL = `${backendURL}/download-attendance`;
            
            // Create a temporary link and trigger download
            const link = document.createElement("a");
            link.href = downloadURL;
            link.download = "attendance.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "white",
            fontSize: "14px",
            fontWeight: "600",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all 0.3s",
            boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 15px 35px rgba(16, 185, 129, 0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 10px 25px rgba(16, 185, 129, 0.3)";
          }}
        >
          📥 Download Attendance Sheet
        </button>
      </div>

      {/* Footer */}
      <div style={{
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: "12px",
      }}>
        <p style={{ margin: 0 }}>Press Enter to submit • Secure attendance system</p>
      </div>
    </div>
  );
}

export default App;