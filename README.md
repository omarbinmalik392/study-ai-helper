# StudyAI Helper

Ein KI-Lernassistent mit einer einzigen Frontend-Datei und einer sicheren Serverless-API.

## Funktionen
- Erklärungen
- Schritt-für-Schritt-Hilfe
- Quiz
- Lernkarten
- Fach und Schwierigkeit
- Responsive Oberfläche

## Deployment
Das Projekt ist für Vercel bzw. eine Umgebung mit Serverless Functions vorbereitet.

1. Repository importieren.
2. Als Environment Variable `OPENAI_API_KEY` setzen.
3. Optional `OPENAI_MODEL` setzen; Standard ist `gpt-5.6-luna`.
4. Deployen.

Der API-Schlüssel darf niemals in `index.html` oder einen öffentlichen GitHub-Commit.

## Lokal
`npm install` und anschließend mit einer Vercel-kompatiblen Entwicklungsumgebung starten.