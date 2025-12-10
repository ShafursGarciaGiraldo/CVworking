// --------------------------------------------------
// 🚀 CVWORKING - SCRIPT PRINCIPAL (VERSIÓN OPTIMIZADA)
// --------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    initThreeJS();
    typeWriterEffect();
    bindInputs();
    updateCV();
});

// INSTANCIA GLOBAL DEL CHATBOT
const cvBot = new CVChatbot();

// --------------------------------------------------
// 💬 CHAT DEL CV
// --------------------------------------------------

function toggleChat() {
    const win = document.getElementById("chat-window");
    win.classList.toggle("hidden");

    if (!win.classList.contains("hidden")) {
        setTimeout(() => document.getElementById("chat-input").focus(), 200);
    }
}

function sendMessage() {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    input.value = "";
    input.disabled = true;

    setTimeout(() => {
        const reply = cvBot.getResponse(text);
        appendMessage(reply, "bot");
        input.disabled = false;
        input.focus();
    }, 500);
}

function appendMessage(text, sender) {
    const container = document.getElementById("chat-messages");
    const div = document.createElement("div");

    div.className =
        sender === "user"
            ? "bg-purple-600/20 text-purple-100 p-3 rounded-xl ml-auto border border-purple-500/30 text-sm w-fit max-w-[85%] animate-fade-in-up"
            : "bg-blue-600/20 text-blue-100 p-3 rounded-xl mr-auto border border-blue-500/30 text-sm w-fit max-w-[85%] animate-fade-in-up";

    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function handleChatEnter(e) {
    if (e.key === "Enter") sendMessage();
}

// --------------------------------------------------
// 📝 FORMULARIO → CV EN TIEMPO REAL
// --------------------------------------------------

function bindInputs() {
    document.querySelectorAll("input, textarea").forEach(el =>
        el.addEventListener("input", updateCV)
    );
}

function updateCV() {
    const map = {
        inputName: "previewName",
        inputRole: "previewRole",
        inputEmail: "previewEmail",
        inputPhone: "previewPhone",
        inputLocation: "previewLocation",
        inputSummary: "previewSummary",
    };

    for (const [srcID, destID] of Object.entries(map)) {
        const src = document.getElementById(srcID);
        const dest = document.getElementById(destID);
        if (src && dest) dest.innerText = src.value || src.placeholder || "";
    }
}

// --------------------------------------------------
// 🎨 CAMBIO DE PLANTILLA
// --------------------------------------------------

function changeTemplate() {
    const prev = document.getElementById("cv-preview");
    prev.className = `paper-a4 ${document.getElementById("templateSelector").value}`;
}

// --------------------------------------------------
// 🤖 IA PARA SUGERENCIAS DE RESUMEN PROFESIONAL
// --------------------------------------------------

async function askAI() {
    const jobTitle = document.getElementById("inputRole").value.trim();
    if (!jobTitle) return alert("⚠️ Escribe un Cargo primero.");

    const loading = document.getElementById("ai-loading");
    const chips = document.getElementById("ai-chips");
    const container = document.getElementById("ai-suggestions-container");

    loading.classList.remove("hidden");
    chips.innerHTML = "";
    container.classList.add("hidden");

    try {
        const res = await fetch("/api/ai-suggestion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobTitle }),
        });

        const data = await res.json();

        loading.classList.add("hidden");
        container.classList.remove("hidden");

        data.suggestions.forEach(text => {
            const chip = document.createElement("div");

            chip.className =
                "bg-blue-600/20 border border-blue-500/50 hover:bg-blue-600 hover:text-white transition text-blue-200 text-xs px-3 py-2 rounded-lg cursor-pointer select-none";

            chip.innerText = text;

            chip.onclick = () => {
                const area = document.getElementById("inputSummary");
                area.value = (area.value + " " + text).trim();
                updateCV();
                chip.remove();
            };

            chips.appendChild(chip);
        });
    } catch (err) {
        console.error("[AI ERROR]", err);
        loading.innerText = "Error de conexión ❌";
    }
}

// --------------------------------------------------
// 📄 GENERAR PDF DEL CV
// --------------------------------------------------

function downloadPDF() {
    const element = document.getElementById("cv-preview");
    const btn = document.getElementById("btn-download");

    btn.disabled = true;
    btn.innerText = "Generando PDF...";

    const opt = {
        margin: 0,
        filename: `CV_${document.getElementById("inputName").value || "SinNombre"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save().then(() => {
        btn.disabled = false;
        btn.innerText = "Descargar PDF";
    });
}

// --------------------------------------------------
// 🌌 BACKGROUND 3D — THREE.JS (OPTIMIZADO)
// --------------------------------------------------

function initThreeJS() {
    const container = document.getElementById("canvas-container");
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Partículas
    const particles = new Float32Array(400 * 3);
    for (let i = 0; i < particles.length; i++) {
        particles[i] = (Math.random() - 0.5) * 10;
    }

    const geo = new THREE.BufferGeometry();
    const mat = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.7,
    });

    geo.setAttribute("position", new THREE.BufferAttribute(particles, 3));
    const starField = new THREE.Points(geo, mat);
    scene.add(starField);

    camera.position.z = 5;

    const animate = () => {
        requestAnimationFrame(animate);
        starField.rotation.y += 0.0008;
        starField.rotation.x += 0.0004;
        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --------------------------------------------------
// ⌨️ EFECTO DE MÁQUINA DE ESCRIBIR
// --------------------------------------------------

function typeWriterEffect() {
    const el = document.getElementById("typewriter");
    if (!el) return;

    const words = ["Profesional", "Impactante", "Inteligente"];
    let i = 0, j = 0, deleting = false;

    function loop() {
        const current = words[i];
        el.innerText = deleting
            ? current.substring(0, j--)
            : current.substring(0, j++);

        if (!deleting && j > current.length) {
            deleting = true;
            setTimeout(loop, 1500);
            return;
        }

        if (deleting && j < 0) {
            deleting = false;
            i = (i + 1) % words.length;
        }

        setTimeout(loop, deleting ? 70 : 140);
    }

    loop();
}

// --------------------------------------------------
// 🌟 FIN DEL SCRIPT MEJORADO
// --------------------------------------------------
