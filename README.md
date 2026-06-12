# CareFlow: Healthcare Support Portal & AI Triage System

### 🔑 Default Admin Credentials
- **mail:** `admin@healthcare.com`
- **password:** `admin123`

----

## 🛠️ Tech Stack

### Frontend
- **React.js & Vite:** Core single-page application structure with high-speed HMR.
- **React Router:** Handles client routing (Patient Form vs. Admin Portal).
- **Axios:** Integrates a JWT-intercepted network requester.
- **Vanilla CSS (CSS Variables):** Custom design system matching medical palettes, supporting glassmorphism cards and smooth light/dark theme shifts.

### Backend
- **Node.js & Express:** Configured routes and controllers for triage administration.
- **Mongoose & MongoDB:** Connects to MongoDB Atlas cloud database. Includes a zero-setup `mongodb-memory-server` in-memory database fallback.
- **Google Gemini Generative AI SDK:** Integrates natural language processing.
- **JWT & bcryptjs:** Secures routes and hashes passwords.

---

## 🧠 AI Idea: Automatic Patient Concern Summary
Community patients often describe their symptoms in long, unstructured, or emotional narratives (e.g. *"I have had fever, headache, body pain, and weakness for three days. I am finding it difficult to work..."*). 

CareFlow integrates the **Google Gemini API** (`gemini-1.5-flash`) immediately on form submission to:
1. Parse the long-form patient text.
2. Extract the core symptoms, duration, and functional impairments.
3. Generate a concise, professional 2-sentence third-person clinical summary.
4. Store the summary alongside the original message for instant triage, bypassing the need for clinicians to read through pages of unstructured text.
5. *Fallback:* If no API key is specified, it utilizes an internal heuristic text parser so the app never crashes.

---

## 🌍 NGO / Non-Profit Use-Case
In under-resourced regions, rural communities, or disaster relief camps, there is a severe shortage of doctors. local NGOs often deploy **Community Health Volunteers** to check on families:
1. **Intake in the Field:** Volunteers carry tablets/phones running CareFlow and log patient details, symptoms, and concerns.
2. **AI Synthesis:** CareFlow instantly translates raw symptoms into concise, standardized clinical summaries.
3. **Remote Triage:** A small team of centralized NGO doctors reviews the Admin Dashboard. Using the **clickable status cards**, they filter by "Pending" or "In Progress" requests, immediately spot critical cases via the AI summaries, and dispatch medical teams, appointment slots, or medication where they are most urgently needed.
4. **Offline Resilience:** Because it supports local database fallbacks, it can run completely locally on a field server.

---

## ⚙️ Running the Project

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Make sure to configure your `GEMINI_API_KEY` and `MONGODB_URI` in [backend/.env](file:///Users/bhukyakairam/Desktop/projects/Mini%20Healthcare%20Support%20Web%20App/backend/.env).*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) to use the application.

