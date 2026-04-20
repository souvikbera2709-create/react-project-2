# Study-Buddy - AI-Powered Study Companion

Study-Buddy is a very complex and beautifully-designed professional React Application aiming to revolutionize the way students track and revise their curriculum. Designed alongside a simulated OpenAI integration engine, it provides interactive AI Tools, auto-scheduling revision queues, and fully responsive Dashboard Analytics.

## 🚀 Built With Modern Tech
- **Core Engine:** Vite + React 19 + React Router DOM
- **State Management:** Custom React Context API & `localStorage`
- **Design & UI:** Tailwind CSS v4 (Custom Glassmorphism + Dark Mode Theme)
- **Fluid UI Animations:** Framer Motion
- **Data Visualization:** Recharts
- **Forms & Validation:** React Hook Form + Yup
- **Utilities:** Axios, Date-Fns, UUID, React Toastify, React Icons

---

## 🌟 Core Features

### 1. 📊 Interactive Analytics Dashboard
A visual homepage equipped with rich **Recharts** rendering dynamic "Topic Status Distributions" and "Subject Completion \%" bar graphs mapping real-time data input from your tasks and curriculums. 

### 2. 📚 Subject & Topic Curriculum Hierarchy
Create overarching subjects customized with unique tag colors. Inside each subject, build out nuanced topics defined by their difficulty (`Easy/Medium/Hard`) and active status (`Not Started/In Progress/Needs Revision/Completed`). 

### 3. 📅 Advanced Task Board
Manage all micro-tasks dynamically.
- Filter through robust tabs: `All`, `Pending`, `Completed`, `Overdue`
- Search bar functionality paired with targeted property sorting.

### 4. 🧠 Spaced-Repetition Auto-Scheduler (Revision)
Whenever you shift a topic's status to **Completed**, the custom context layer automatically triggers an event scheduler, queueing up a fresh "Revision" requirement precisely 3 days into the future!

### 5. 🤖 Integrated AI Simulation (GPT-4o)
Elevate study outcomes utilizing the dedicated AI Assistant page featuring responsive Framer Motion page flips. Select your topic text from dropdowns and request one of three modes:
- **Topic Summaries:** Detailed breakdown and context generation.
- **Practice Q&A:** Automated question generations.
- **3D Flashcards:** Interactive hover-to-flip functional UI flashcards!

---

## ⚙️ Getting Started

### Prerequisites

You will need `Node.js` installed on your machine.

### Installation

1. **Navigate to the root directory**
   ```bash
   cd my-react-app
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Open Application**
   Visit `http://localhost:5173` in your browser. All your progress will be securely saved into your browser's persistent `localStorage`.

---

## 🔒 A Note On The AI Service
Right now, the project leverages a highly-reliable simulated response service inside `/services/aiService.js` to avoid exposing literal external API keys or generating charges in a raw web deployment. 

For future development, the service is built modularly with `axios` imports already loaded—allowing you to easily drag and drop your `OPENAI_API_KEY`!
