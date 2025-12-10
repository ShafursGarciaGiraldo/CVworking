function toggleChat() {
  document.getElementById("chat-window").classList.toggle("hidden");
}

function sendMessage() {
  let input = document.getElementById("chat-input");
  let msg = input.value.trim();
  if (!msg) return;

  let chat = document.getElementById("chat-messages");

  // mensaje del usuario
  chat.innerHTML += `
    <div class="mb-2 text-right">
      <span class="bg-blue-600 px-3 py-1 rounded-lg inline-block">${msg}</span>
    </div>
  `;

  // respuesta tipo IA
  setTimeout(() => {
    chat.innerHTML += `
      <div class="mb-2">
        <span class="bg-white/10 px-3 py-1 rounded-lg inline-block">
          Gracias por tu mensaje. Estoy aquí para ayudarte con tu CV ✨
        </span>
      </div>
    `;
    chat.scrollTop = chat.scrollHeight;
  }, 400);

  input.value = "";
}

function handleChatEnter(e) {
  if (e.key === "Enter") sendMessage();
}
