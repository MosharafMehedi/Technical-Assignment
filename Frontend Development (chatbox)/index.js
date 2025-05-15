function toggleAuth(form) {
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("signup-form").classList.add("hidden");
  document.getElementById(`${form}-form`).classList.remove("hidden");
}

function signup() {
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const exists = users.find((u) => u.email === email);

  if (exists) {
    alert("User already exists. Please login.");
    toggleAuth("login");
    return;
  }

  users.push({ email, password: btoa(password) });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful. Please login.");
  toggleAuth("login");
}

function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (u) => u.email === email && u.password === btoa(password)
  );

  if (user) {
    localStorage.setItem("user", JSON.stringify({ email }));
    showChat();
  } else {
    alert("Invalid email or password.");
  }
}

function logout() {
  localStorage.removeItem("user");
  document.getElementById("chat-container").classList.add("hidden");
  document.getElementById("auth-container").classList.remove("hidden");
  toggleAuth("login");
}

function showChat() {
  document.getElementById("auth-container").classList.add("hidden");
  document.getElementById("chat-container").classList.remove("hidden");
}

function sendMessage() {
  const input = document.getElementById("message-input");
  const message = input.value.trim();
  if (message !== "") {
    const chatBox = document.getElementById("chat-box");
    const div = document.createElement("div");
    div.className = "chat-message";
    div.textContent = message;
    chatBox.appendChild(div);
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

window.onload = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) showChat();
};
