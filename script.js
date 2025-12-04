// script.js — simple chat UI logic
// IMPORTANT: change API_URL to your Render backend URL (example shown)
 const API_URL = "https://jarvis-backend-78uf.onrender.com"; //<- put your backend URL here

const form = document.querySelector("#chat-form");
const input = document.querySelector("#message-input");
const messages = document.querySelector("#messages");
const sendBtn = document.querySelector("#send-btn");

function appendMessage(text, who = "bot") {
  const el = document.createElement("div");
  el.className = `message ${who}`;
  el.textContent = text;
  messages.appendChild(el);
  messages.scrollTop = messages.scrollHeight;
}

function setLoading(on = true) {
  sendBtn.disabled = on;
  sendBtn.textContent = on ? "Thinking..." : "Send";
}

async function sendMessage(message) {
  try {
    setLoading(true);
    appendMessage(message, "user");

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }

    const data = await res.json();
    // try several common shapes for response text
    const text =
      data.output_text ||
      (data.output && (data.output[0]?.content || data.output)) ||
      data.text ||
      JSON.stringify(data);

    appendMessage(text, "bot");
  } catch (err) {
    appendMessage("Error: " + (err.message || err), "bot");
  } finally {
    setLoading(false);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg) return;
  input.value = "";
  sendMessage(msg);
});
