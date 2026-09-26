import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const modeInstructions = {
  explain: "Erkläre das Thema verständlich, mit kurzen Beispielen. Passe die Erklärung an die angegebene Schwierigkeit an.",
  steps: "Löse die Aufgabe Schritt für Schritt. Erkläre jeden Schritt so, dass ein Schüler ihn nachvollziehen und selbst wiederholen kann.",
  quiz: "Erstelle ein kurzes Lernquiz mit 5 Fragen. Gib die Lösungen erst nach den Fragen in einem klar getrennten Abschnitt an.",
  flashcards: "Erstelle 8 kompakte Lernkarten im Format Frage: ... / Antwort: ... ."
};

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/study", async (req, res) => {
  try {
    const { question, subject = "Allgemein", difficulty = "Mittel", mode = "explain" } = req.body || {};
    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "Bitte gib eine Frage oder Aufgabe ein." });
    }
    if (question.length > 5000) {
      return res.status(400).json({ error: "Die Eingabe ist zu lang (max. 5000 Zeichen)." });
    }

    const instructions = [
      "Du bist StudyAI, ein geduldiger Lernassistent.",
      "Hilf beim Verstehen statt nur die Antwort hinzuschreiben.",
      "Wenn eine Aufgabe mehrere Schritte hat, erkläre die Denkweise.",
      "Wenn Informationen fehlen, sage klar, welche Annahme du machst.",
      "Antworte auf Deutsch, außer der Nutzer bittet um eine andere Sprache.",
      "Keine erfundenen Quellen oder Fakten.",
      "Fach: " + subject,
      "Schwierigkeit: " + difficulty,
      "Modus: " + (modeInstructions[mode] || modeInstructions.explain)
    ].join("\n");

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      instructions,
      input: question,
      store: false
    });

    res.json({ answer: response.output_text || "Ich konnte gerade keine Antwort erzeugen." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Die KI konnte gerade nicht antworten. Prüfe deinen API-Schlüssel und versuche es erneut." });
  }
});

app.listen(port, () => {
  console.log(`StudyAI läuft auf http://localhost:${port}`);
});
