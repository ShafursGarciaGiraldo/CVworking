// ------------------------------------------------------
//  🌐 CVWORKING BACKEND - API Nivel LEGENDARIO ⚡
// ------------------------------------------------------

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

// Generador IA local
const CVGenerator = require("./generator");
const generator = new CVGenerator();

const app = express();
const PORT = process.env.PORT || 3000;

// ------------------------------------------------------
// 🧱 MIDDLEWARE PROFESIONAL
// ------------------------------------------------------

app.use(cors({
    origin: "*",
    methods: "GET,POST",
    allowedHeaders: "Content-Type"
}));

app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.static("public")); // Frontend

// ------------------------------------------------------
// 🧠 CARGAR BASE DE CONOCIMIENTO IA
// ------------------------------------------------------

const aiDataPath = path.join(__dirname, "data", "ai_suggestions.json");
let aiKnowledgeBase = {};

function loadKnowledgeBase() {
    try {
        const data = fs.readFileSync(aiDataPath, "utf8");
        aiKnowledgeBase = JSON.parse(data);
        console.log("✅ IA Knowledge Base cargada correctamente.");
    } catch (err) {
        console.error("❌ Error cargando IA. Usando fallback.");
        aiKnowledgeBase = {
            general: [
                "Profesional responsable.",
                "Trabajo en equipo.",
                "Comunicación efectiva.",
                "Orientado a resultados."
            ]
        };
    }
}

loadKnowledgeBase();

// ------------------------------------------------------
// 🔥 DETECCIÓN INTELIGENTE DE CATEGORÍA DE PUESTO
// ------------------------------------------------------

function detectCategory(jobTitle) {
    const text = jobTitle.toLowerCase();
    const categories = [
        { key: "web",    words: ["web", "software", "developer", "programador", "frontend", "backend", "fullstack"] },
        { key: "minas",  words: ["minería", "mina", "geología", "geólogo", "topografía", "ingeniería de minas"] },
        { key: "gestion", words: ["jefe", "gerente", "manager", "coordinador", "supervisor", "líder"] }
    ];

    for (const cat of categories) {
        if (cat.words.some(w => text.includes(w))) return cat.key;
    }

    return "general";
}

// ------------------------------------------------------
// 🧩 ENDPOINT: Estado del servidor
// ------------------------------------------------------

app.get("/api/status", (req, res) => {
    res.json({
        status: "Online",
        server: "CVworking API",
        uptime: `${process.uptime().toFixed(1)}s`
    });
});

// ------------------------------------------------------
// 🤖 ENDPOINT: SUGERENCIAS IA (texto base)
// ------------------------------------------------------

app.post("/api/ai-suggestion", (req, res) => {
    const { jobTitle } = req.body;

    if (!jobTitle) {
        return res.status(400).json({ error: "El campo jobTitle es obligatorio." });
    }

    const category = detectCategory(jobTitle);
    let suggestions = aiKnowledgeBase[category] || [];

    // Completar con general si hay pocas
    if (suggestions.length < 3 && aiKnowledgeBase.general) {
        suggestions = suggestions.concat(aiKnowledgeBase.general);
    }

    // Mezcla y selecciona 4
    suggestions = [...new Set(suggestions)]
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

    res.json({ category, suggestions });
});

// ------------------------------------------------------
// 🔥 ENDPOINT PRINCIPAL: Generador de perfiles completos
// ------------------------------------------------------

app.post("/api/generate-profile", (req, res) => {
    const { jobTitle } = req.body;

    if (!jobTitle) {
        return res.status(400).json({ error: "Falta jobTitle" });
    }

    try {
        const result = generator.generateFullProfile(jobTitle, 6);
        res.json({ ok: true, data: result });

    } catch (err) {
        console.error("❌ Error generando perfil:", err.message);
        res.status(500).json({ ok: false, error: "Error generando el perfil IA." });
    }
});

// ------------------------------------------------------
// ❗ MANEJO GLOBAL DE ERRORES
// ------------------------------------------------------

app.use((err, req, res, next) => {
    console.error("🔥 Error global:", err);
    res.status(500).json({
        error: "Error interno del servidor.",
        details: err.message,
    });
});

// ------------------------------------------------------
// 🚀 INICIAR SERVIDOR
// ------------------------------------------------------

app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando → http://localhost:${PORT}`);
});
