import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StudyProvider } from './context/StudyContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Subjects } from './pages/Subjects';
import { Tasks } from './pages/Tasks';
import { Revision } from './pages/Revision';
import { AITools } from './pages/AITools';

function App() {
  return (
    <ThemeProvider>
      <StudyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="subjects" element={<Subjects />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="revision" element={<Revision />} />
              <Route path="ai-tools" element={<AITools />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StudyProvider>
    </ThemeProvider>
  );
}

export default App;
