let token = null;
let socket = null;
let userId = null;

// Signup Function
async function signup() {
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (!username || username.length < 3) {
    alert("Username must be at least 3 characters long.");
    return;
  }

  if (!password || password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful! Now log in.");
      window.location = "index.html";
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    alert("Signup error");
    console.error(err);
  }
}

// Login Function
async function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    token = data.token;

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", userId);
      window.location = "chat.html";
    } else {
      alert("Login failed");
    }
  } catch (err) {
    alert("Login error");
    console.error(err);
  }
}

// Initialize Chat Page
function initChat() {
  token = sessionStorage.getItem("token");
  userId = sessionStorage.getItem("userId");

  if (!token || !userId) {
    alert("Unauthorized");
    window.location = "index.html";
    return;
  }

  socket = io("http://localhost:5000");

  socket.on("connect", () => {
    console.log("Connected to chat");
    socket.emit("joinRoom", { roomName: "global" });
  });

  socket.on("receiveMessage", (msg) => {
    console.log("Message received:", msg); // Debug log

    const messagesDiv = document.getElementById("messages");
    if (!messagesDiv) {
      console.warn("Missing #messages element in DOM.");
      return;
    }

    const el = document.createElement("div");
    el.innerText = `${msg.content} (from user ${msg.userId || "unknown"})`;
    messagesDiv.appendChild(el);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

// Send Message Function
function sendMessage() {
  const input = document.getElementById("messageInput");
  if (!input || !socket) return;

  const content = input.value.trim();
  if (content) {
    socket.emit("sendMessage", {
      content,
      roomName: "global",
      userId,
    });
    input.value = "";
  }
}

// Logout Function
function logout() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userId");
  window.location = "index.html";
}

// Auto-init chat page
if (window.location.pathname.endsWith("chat.html")) {
  window.addEventListener("DOMContentLoaded", initChat);
}
