// generator.js - Versión LEGENDARIA🔥
// Motor IA local para generar perfiles, resúmenes y bullets profesionales
// Funciona junto a data/ai_suggestions.json

const fs = require("fs");
const path = require("path");

class CVGenerator {
    constructor() {
        this.db = this._loadBrain();

        // Pesos para mezclar contenido tipo IA
        this.weights = {
            summary: 0.35,
            responsibilities: 0.45,
            achievements: 0.20,
        };

        // Datos mock
        this.mockNames = ["Juan Pérez", "Ana Gómez", "Carlos Díaz", "María López", "Luis Torres"];
        this.mockRoles = ["Ingeniero de Minas Junior", "Desarrollador Web Full Stack", "Jefe de Operaciones", "Asistente de Geología"];
    }

    /**
     * ------------------------------------------------------------------------------------
     * 🧠 Cargar base de datos de texto
     * ------------------------------------------------------------------------------------
     */
    _loadBrain() {
        const aiPath = path.join(__dirname, "data", "ai_suggestions.json");

        try {
            const raw = fs.readFileSync(aiPath, "utf8");
            const parsed = JSON.parse(raw);

            if (typeof parsed !== "object") throw new Error("Archivo corrupto");

            return parsed;
        } catch (error) {
            console.warn("⚠️ Base IA no encontrada, cargando MODO SEGURO.");
            return { web: {}, minas: {}, gestion: {}, general: {} };
        }
    }

    /**
     * ------------------------------------------------------------------------------------
     * 🔍 Limpia texto y mejora estilo
     * ------------------------------------------------------------------------------------
     */
    clean(text) {
        if (!text) return "";
        return text
            .replace(/\s+/g, " ")
            .replace(/^./, (c) => c.toUpperCase())
            .trim();
    }

    /**
     * Detecta categoría para seleccionar sugerencias correctas
     */
    detectCategory(role = "") {
        const t = role.toLowerCase();
        if (t.includes("web") || t.includes("software") || t.includes("developer")) return "web";
        if (t.includes("mina") || t.includes("geo") || t.includes("voladura") || t.includes("subterránea")) return "minas";
        if (t.includes("jefe") || t.includes("gerente") || t.includes("manager") || t.includes("líder")) return "gestion";
        return "general";
    }

    /**
     * ------------------------------------------------------------------------------------
     * 📝 Genera resumen profesional
     * ------------------------------------------------------------------------------------
     */
    generateSummary(jobTitle) {
        const category = this.detectCategory(jobTitle);
        const pack = this.db[category];

        const base = pack?.summary || ["Profesional orientado a resultados."];
        const picked = this.pick(base);

        return this.clean(`${picked} Enfocado en el puesto de ${jobTitle}.`);
    }

    /**
     * ------------------------------------------------------------------------------------
     * 📌 Genera bullets profesionales
     * ------------------------------------------------------------------------------------
     */
    generateBullets(jobTitle, count = 5) {
        const category = this.detectCategory(jobTitle);
        const pack = this.db[category] || {};

        const resp = this.shuffle(pack.responsibilities || []);
        const achv = this.shuffle(pack.achievements || []);
        const summ = this.shuffle(pack.summary || []);

        const bullets = [
            ...resp.slice(0, Math.ceil(count * this.weights.responsibilities)),
            ...achv.slice(0, Math.ceil(count * this.weights.achievements)),
            ...summ.slice(0, Math.ceil(count * this.weights.summary)),
        ];

        return bullets.slice(0, count).map((b) => this.clean(b));
    }

    /**
     * ------------------------------------------------------------------------------------
     * 🎯 Genera perfil completo
     * ------------------------------------------------------------------------------------
     */
    generateFullProfile(jobTitle, bullets = 6) {
        return {
            summary: this.generateSummary(jobTitle),
            bullets: this.generateBullets(jobTitle, bullets),
        };
    }

    /**
     * ------------------------------------------------------------------------------------
     * 🎲 Utilidades internas
     * ------------------------------------------------------------------------------------
     */
    pick(list) {
        if (!list || list.length === 0) return "";
        return list[Math.floor(Math.random() * list.length)];
    }

    shuffle(list) {
        return [...list].sort(() => Math.random() - 0.5);
    }

    randomID() {
        return Math.random().toString(36).slice(2, 8);
    }

    /**
     * ------------------------------------------------------------------------------------
     * 📊 Sistema de simulación automática (mejorado)
     * ------------------------------------------------------------------------------------
     */
    runDailySimulation() {
        console.log("\n🤖 CVWORKING – Simulación diaria iniciada...\n");

        const report = [];

        for (let i = 0; i < 3; i++) {
            const user = this.pick(this.mockNames);
            const role = this.pick(this.mockRoles);

            const res = this.generateFullProfile(role, 3);

            report.push({
                id: this.randomID(),
                timestamp: new Date().toISOString(),
                user,
                role,
                summary_chars: res.summary.length,
                bullets_count: res.bullets.length,
                status: "ok",
            });
        }

        this.saveReport(report);
    }

    /**
     * ------------------------------------------------------------------------------------
     * 🗂 Guardado de logs mejorado
     * ------------------------------------------------------------------------------------
     */
    saveReport(data) {
        const logPath = path.join(__dirname, "daily_metrics.log");

        const header = `\n--- REPORTE ${new Date().toLocaleString()} ---\n`;
        fs.appendFileSync(logPath, header + JSON.stringify(data, null, 2));

        console.log(`✅ Reporte guardado → ${logPath}`);
    }

    /**
     * ------------------------------------------------------------------------------------
     * 🔥 NUEVO: API LOCAL para tu frontend
     * ------------------------------------------------------------------------------------
     */
    generateForAPI(jobTitle, bullets = 5) {
        return {
            ok: true,
            generated_at: Date.now(),
            data: this.generateFullProfile(jobTitle, bullets),
        };
    }
}

module.exports = CVGenerator;

// Ejecutar si se llama desde terminal
if (require.main === module) {
    const engine = new CVGenerator();
    engine.runDailySimulation();
}
        const choice = this.pick(options);
        this.lastResponses.add(choice);
