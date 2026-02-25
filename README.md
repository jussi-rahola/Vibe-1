# Vibe-1 — EV Inventory Manager

A full-stack inventory management app for electric vehicles, charging equipment and accessories.

- **Frontend:** React + Vite + Tailwind CSS (port 5173)
- **Backend:** Node.js + Express + SQLite (port 3001)

---

## Getting Started

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Launch the app (development)

**Option A — single command (recommended)**
```bash
npm run dev
```
This starts both the backend and frontend concurrently.

**Option B — two separate terminals**

*Terminal 1 — Backend*
```bash
npm run start:backend
```
The API server starts at `http://localhost:3001`.

*Terminal 2 — Frontend*
```bash
npm run start:frontend
```
The app opens at `http://localhost:5173`.

---

## Deploying to the cloud

### Build for production

```bash
npm run build
```
This compiles the frontend into `frontend/dist/`.

### Run in production mode

```bash
NODE_ENV=production npm start
```
The backend serves the frontend at `http://localhost:3001`.

### Deploy to Railway

1. Push your code to GitHub.
2. Go to [railway.app](https://railway.app) and create a new project from your GitHub repo.
3. Set the **root directory** to `/` and the **start command** to:
   ```
   npm run build && NODE_ENV=production npm start
   ```
4. Railway will detect Node.js automatically and deploy your app.

### Deploy to Render

1. Go to [render.com](https://render.com) and create a new **Web Service** from your GitHub repo.
2. Set **Build Command** to:
   ```
   npm run install:all && npm run build
   ```
3. Set **Start Command** to:
   ```
   NODE_ENV=production npm start
   ```
4. Render will build and deploy your app automatically.

---

## Committing changes to Git

```bash
# Stage all changes
git add .

# Commit with a message
git commit -m "your message here"

# Push to GitHub
git push
```