// ------------------------------------------------------
// 🤖 CVWORKING CHATBOT — NIVEL LEGENDARIO ✨
// ------------------------------------------------------

class CVChatbot {
    constructor() {
        this.lastResponses = new Set();

        this.memory = {
            lastIntent: null,
            userName: null,
            tone: "neutral", // formal | chill | motivador
        };

        // Palabras clave detectadas por intención
        this.keywords = {
            greeting: ["hola", "buenas", "hey", "saludos", "qué tal"],
            cv_tips: ["cv", "curriculum", "currículum", "hoja de vida", "tip", "consejo", "optimizar"],
            interview: ["entrevista", "postular", "reclutador", "rrhh", "preguntas"],
            skills: ["skill", "habilidad", "competencia", "fortaleza"],
            mining: ["minería", "mina", "minero", "geólogo", "geología", "ingeniería de minas"],
        };

        // Respuestas mejoradas
        this.intents = {
            greeting: [
                "¡Hola! ¿Listo para construir un CV legendario? 😄🔥",
                "¡Hey! ¿Qué parte de tu CV quieres mejorar hoy? ✨",
                "¡Bienvenido! Vamos a hacerlo épico. 🚀"
            ],

            cv_tips: [
                "Tu CV debe hablar con números. Logros como *reduje tiempos en 18%* impresionan siempre.",
                "Coloca verbos de impacto: *implementé, optimicé, desarrollé, coordiné*. Eso te sube de nivel.",
                "Si no tienes experiencia, potencia proyectos, voluntariados y certificaciones. *Todo suma*."
            ],

            interview: [
                "Usa el método STAR. Te hace ver ordenado, profesional y seguro.",
                "Siempre investiga la empresa antes de tu entrevista. Te da ventaja real.",
                "Haz preguntas inteligentes sobre cultura, tecnologías y retos del puesto."
            ],

            skills: [
                "Divide tus habilidades en Hard Skills y Soft Skills. ATS lo AMA.",
                "Destaca software, idiomas y herramientas medibles.",
                "Ordena tus skills de más fuerte → más débil. Da impresión profesional."
            ],

            mining: [
                "En minería: seguridad, normativa, sostenibilidad y riesgos son claves.",
                "Incluye software minero: Surpac, Vulcan, Datamine, ArcGIS, Leapfrog.",
                "Si participaste en estudios o simulaciones, describe aportes concretos."
            ],

            fallback: [
                "Puedo ayudarte con tu CV, entrevistas, skills o minería. ¿Qué necesitas?",
                "Interesante… ¿quieres mejorar tu perfil, experiencia o educación?",
                "No entendí bien, pero estoy aquí contigo. ¿CV, skills o entrevistas?"
            ]
        };
    }

    // ------------------------------------------------------
    // 🧠 DETECCIÓN INTELIGENTE DE TONO DEL USUARIO
    // ------------------------------------------------------
    detectTone(msg) {
        if (msg.includes("shii") || msg.includes("bro") || msg.includes("xd"))
            return "chill";
        if (msg.includes("ayuda") || msg.includes("estres") || msg.includes("por favor"))
            return "motivador";
        return "formal";
    }

    // ------------------------------------------------------
    // 🧠 NLU LIGERO (intención avanzada)
    // ------------------------------------------------------
    detectIntent(msg) {
        for (const intent in this.keywords) {
            if (this.keywords[intent].some(k => msg.includes(k))) {
                return intent;
            }
        }
        return null;
    }

    // ------------------------------------------------------
    // 🎤 RESPUESTA PRINCIPAL
    // ------------------------------------------------------
    getResponse(message) {
        const msg = message.toLowerCase();

        // Detectar tono del usuario
        this.memory.tone = this.detectTone(msg);

        // Detectar nombre
        if (msg.includes("me llamo") || msg.includes("mi nombre es")) {
            const name = msg.replace(/.*(me llamo|mi nombre es)\s*/, "").trim();
            this.memory.userName = name.charAt(0).toUpperCase() + name.slice(1);
            return `¡Mucho gusto, ${this.memory.userName}! 😊 ¿Qué parte de tu CV quieres mejorar?`;
        }

        // Detectar intención por palabras clave mejoradas
        const intent = this.detectIntent(msg);

        if (intent) return this.respond(intent);

        // Continuar tema anterior
        if (this.memory.lastIntent) return this.respond(this.memory.lastIntent);

        // Respuesta por defecto
        return this.respond("fallback");
    }

    // ------------------------------------------------------
    // 🔥 RESPUESTA SEGÚN INTENCIÓN
    // ------------------------------------------------------
    respond(intent) {
        this.memory.lastIntent = intent;

        let responses = this.intents[intent];

        // Evitar repetición
        let options = responses.filter(x => !this.lastResponses.has(x));
        if (options.length === 0) {
            this.lastResponses.clear();
            options = responses;
        }

        let response = options[Math.floor(Math.random() * options.length)];

        // Adaptar según tono
        if (this.memory.tone === "chill") {
            response += " 😎";
        } else if (this.memory.tone === "motivador") {
            response = "✨ Tranquilo, estás haciendo un gran trabajo. " + response;
        }

        this.lastResponses.add(response);
        return response;
    }
}
// ------------------------------------------------------
