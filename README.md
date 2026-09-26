# StudyAI Helper

An AI-powered study helper with a simple frontend and a secure server endpoint.

## How it works

The browser sends the student's question to /api/chat. The server reads OPENAI_API_KEY from an environment variable and calls the OpenAI Responses API. The secret key is never placed in index.html.

## Deploying

This project is designed for a host that supports Vercel-style serverless functions.

1. Import this GitHub repository into your deployment provider.
2. Add an environment variable named OPENAI_API_KEY.
3. Put your API key in that environment variable. Do not commit it to GitHub.
4. Deploy.
5. Open the deployed site and ask StudyAI a question.

## Important

Do not create a file containing your API key and commit it to this repository. If a key is ever exposed, revoke it and create a new one.

## Local development

Install the Vercel CLI, then run:

vercel dev

The site should be available locally and /api/chat will use your OPENAI_API_KEY environment variable.
