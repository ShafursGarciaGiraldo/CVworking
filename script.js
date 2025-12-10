// ===== ACTUALIZAR CV =====
function updateCV() {
  const name = document.getElementById("inputName").value;
  const role = document.getElementById("inputRole").value;
  const email = document.getElementById("inputEmail").value;
  const phone = document.getElementById("inputPhone").value;
  const location = document.getElementById("inputLocation").value;
  const summary = document.getElementById("inputSummary").value;

  document.getElementById("cv-preview").innerHTML = `
    <h1 style="font-size: 32px; font-weight: bold;">${name || ""}</h1>
    <p style="font-size: 18px; margin-top:-6px; color: #444;">${role || ""}</p>
    <hr style="margin: 12px 0;" />

    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Teléfono:</strong> ${phone}</p>
    <p><strong>Ubicación:</strong> ${location}</p>

    <h3 style="margin-top:20px; font-weight:600;">Perfil Profesional</h3>
    <p style="line-height:1.5;">${summary}</p>
  `;
}

// ===== CAMBIAR TEMPLATE =====
function changeTemplate() {
  const preview = document.getElementById("cv-preview");
  const template = document.getElementById("templateSelector").value;

  preview.className = `paper-a4 ${template}`;
}

// ===== DESCARGAR PDF =====
function downloadPDF() {
  const element = document.getElementById("cv-preview");

  const options = {
    margin: 0,
    filename: "Mi_CV.pdf",
    html2canvas: { scale: 3 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(options).from(element).save();
}

// ===== IA SIMPLIFICADA (LOCAL) =====
function askAI() {
  const suggestions = [
    "Profesional proactivo con capacidad para adaptarse rápidamente a nuevos retos.",
    "Experiencia en gestión, análisis y resolución eficiente de problemas.",
    "Orientado a resultados, con enfoque en mejora continua.",
    "Habilidades destacadas en trabajo en equipo y comunicación efectiva.",
    "Alta capacidad para aprender nuevas tecnologías y procesos."
  ];

  const container = document.getElementById("ai-chips");
  const wrapper = document.getElementById("ai-suggestions-container");

  wrapper.classList.remove("hidden");
  container.innerHTML = "";

  suggestions.forEach(text => {
    const chip = document.createElement("button");
    chip.className = "bg-white/10 px-3 py-1 rounded-full text-xs hover:bg-white/20 transition";
    chip.textContent = text;
    chip.onclick = () => {
      document.getElementById("inputSummary").value = text;
      updateCV();
    };
    container.appendChild(chip);
  });
}

