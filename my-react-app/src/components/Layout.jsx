import { NavLink, Outlet } from 'react-router-dom';
import { FiHome, FiBook, FiCheckSquare, FiRepeat, FiCpu, FiMenu, FiSun, FiMoon } from 'react-icons/fi';
import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <FiHome size={20} /> },
    { name: 'Subjects', path: '/subjects', icon: <FiBook size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <FiCheckSquare size={20} /> },
    { name: 'Revision', path: '/revision', icon: <FiRepeat size={20} /> },
    { name: 'AI Assistant', path: '/ai-tools', icon: <FiCpu size={20} /> }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900 text-gray-100">
      {/* Sidebar Desktop */}
      <motion.aside 
        initial={{ width: 250 }}
        animate={{ width: sidebarOpen ? 250 : 80 }}
        className="hidden md:flex flex-col bg-dark-800 border-r border-dark-700 transition-all duration-300"
      >
        <div className="p-4 flex items-center justify-between border-b border-dark-700 h-16">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-bold text-xl text-primary whitespace-nowrap overflow-hidden">
                Study-Buddy
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white p-2">
            <FiMenu size={24} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-gray-400 hover:text-white hover:bg-dark-700'}`}
            >
              <div className="flex-shrink-0">{link.icon}</div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="font-medium whitespace-nowrap">
                    {link.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-dark-800 via-dark-900 to-dark-900">
        <header className="h-16 flex items-center px-6 lg:px-8 border-b border-dark-700/50 backdrop-blur-md sticky top-0 z-10">
          <h1 className="text-xl font-semibold opacity-80">AI-Powered Overview</h1>
          <div className="ml-auto flex items-center space-x-6">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-dark-800 border border-dark-600 text-gray-400 hover:text-primary transition-colors hover:shadow-lg shadow-black/5"
              title="Toggle Light/Dark Mode"
            >
              {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </button>
            {/* Pseudo-profile avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary shadow-lg shadow-primary/20 cursor-pointer"></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>

      {/* Mobile nav (Bottom) */}
      <nav className="md:hidden fixed bottom-0 w-full glass-panel border-t-0 rounded-b-none py-3 px-6 flex justify-between z-50">
        {navLinks.map((link) => (
          <NavLink key={link.path} to={link.path} className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg ${isActive ? 'text-primary' : 'text-gray-400'}`}>
            {link.icon}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
