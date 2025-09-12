# Project

The legacy Python backend has been removed. The RAG knowledge base remains under backend/data/knowledge_base and is used by the Next.js API.

If you deploy on Vercel, ensure you set the GEMINI_API_KEY environment variable in Project Settings.

Note: CI uses pnpm with default frozen-lockfile. To avoid ERR_PNPM_OUTDATED_LOCKFILE, this repo includes a .npmrc that sets `install.frozen-lockfile=false`. If you prefer strict lockfile enforcement, run `pnpm install` locally and commit the generated pnpm-lock.yaml.
