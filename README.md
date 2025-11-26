# Compramos Juntos — Starter Repo
Contenido: web (Next.js), mobile (Expo), functions (Firebase Cloud Functions).

Instrucciones rápidas:
1. Copiar `.env.example` a `.env.local` (web) y `functions/.env` (functions) y completar variables.
2. Instalar dependencias en cada carpeta y ejecutar:
   - Web: `cd web && npm install && npm run dev`
   - Mobile: `cd mobile && npm install && expo start`
   - Functions: `cd functions && npm install && firebase emulators:start --only functions`
3. Reemplazar las credenciales de Firebase y Mercado Pago antes de usar en producción.
