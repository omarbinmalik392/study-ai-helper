import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const modes = {
  explain: "Erkläre verständlich und mit kurzen Beispielen.",
  steps: "Löse die Aufgabe Schritt für Schritt und erkläre jeden Schritt.",
  quiz: "Erstelle ein kurzes Quiz mit 5 Fragen und gib die Lösungen danach getrennt an.",
  flashcards: "Erstelle 8 kompakte Lernkarten im Format Frage: ... / Antwort: ...."
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Nur POST ist erlaubt." });
  try {
    const { question, subject="Allgemein", difficulty="Mittel", mode="explain" } = req.body || {};
    if (typeof question !== "string" || !question.trim()) return res.status(400).json({ error: "Bitte gib eine Frage ein." });
    if (question.length > 5000) return res.status(400).json({ error: "Die Frage ist zu lang (max. 5000 Zeichen)." });
    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: "OPENAI_API_KEY ist beim Hosting noch nicht gesetzt." });

    const instructions = [
      "Du bist StudyAI, ein geduldiger Lernassistent für Schüler.",
      "Hilf beim Verstehen, statt nur eine fertige Antwort hinzuschreiben.",
      "Antworte auf Deutsch, außer eine andere Sprache wird verlangt.",
      "Passe die Erklärung an die Schwierigkeit an.",
      "Fach: " + subject,
      "Schwierigkeit: " + difficulty,
      "Aufgabenmodus: " + (modes[mode] || modes.explain),
      "Erfinde keine Quellen oder Fakten."
    ].join("\n");

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      instructions,
      input: question,
      store: false
    });

    return res.status(200).json({ answer: response.output_text || "Ich konnte keine Antwort erzeugen." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Die KI konnte gerade nicht antworten. Prüfe den API-Schlüssel und die Hosting-Einstellungen." });
  }
}