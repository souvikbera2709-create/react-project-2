import { useContext, useState } from 'react';
import { StudyContext } from '../context/StudyContext';
import { FiPlus, FiTrash2, FiEdit2, FiTag, FiBook } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const Subjects = () => {
  const { subjects, addSubject, deleteSubject, topics, addTopic, updateTopic, deleteTopic } = useContext(StudyContext);
  
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState('#6366f1');
  const [activeSubject, setActiveSubject] = useState(subjects[0]?.id || null);
  
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDiff, setNewTopicDiff] = useState('Medium');

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    addSubject({ name: newSubjectName, color: newSubjectColor });
    setNewSubjectName('');
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !activeSubject) return;
    addTopic({ subjectId: activeSubject, title: newTopicTitle, difficulty: newTopicDiff });
    setNewTopicTitle('');
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col h-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-success to-primary">Curriculum</h1>
          <p className="text-gray-400 mt-1">Manage subjects and course topics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 h-[calc(100vh-200px)]">
        {/* Subjects Panel */}
        <div className="glass-panel p-6 flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-dark-700/50 flex items-center"><FiBook size={20} className="mr-3 text-primary" />Subjects</h2>
          
          <form onSubmit={handleAddSubject} className="mb-6 flex gap-2">
            <input type="text" placeholder="New subject..." className="input-field flex-1" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} />
            <input type="color" className="w-12 h-10 rounded cursor-pointer bg-dark-800 border-none outline-none p-1" value={newSubjectColor} onChange={e => setNewSubjectColor(e.target.value)} />
            <button type="submit" className="btn-primary p-2"><FiPlus size={20} /></button>
          </form>

          <div className="overflow-y-auto custom-scrollbar flex-1 space-y-2 pr-2">
            <AnimatePresence>
              {subjects.map(s => (
                <motion.div key={s.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                  onClick={() => setActiveSubject(s.id)}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${activeSubject === s.id ? 'bg-dark-700/80 border-dark-600 shadow-md transform translate-x-1' : 'bg-dark-800 border-transparent hover:bg-dark-700/30 hover:border-dark-700'}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: s.color }}></span>
                    <span className="font-medium">{s.name}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteSubject(s.id); }} className="text-dark-600 hover:text-danger p-2 rounded-lg hover:bg-danger/10 transition-colors"><FiTrash2 /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Topics Panel */}
        <div className="glass-panel p-6 lg:col-span-2 flex flex-col h-full bg-gradient-to-br from-dark-800/80 to-dark-900/80">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-dark-700/50 flex items-center"><FiTag size={20} className="mr-3 text-secondary" />Topics</h2>
          
          {activeSubject ? (
            <>
              <form onSubmit={handleAddTopic} className="mb-8 p-4 bg-dark-800 rounded-xl border border-dark-700">
                <div className="flex flex-col md:flex-row gap-3">
                  <input type="text" placeholder="Topic title..." className="input-field flex-1" value={newTopicTitle} onChange={e => setNewTopicTitle(e.target.value)} />
                  <select className="input-field md:w-40 appearance-none bg-dark-900" value={newTopicDiff} onChange={e => setNewTopicDiff(e.target.value)}>
                    <option value="Easy">⭐ Easy</option>
                    <option value="Medium">⭐⭐ Medium</option>
                    <option value="Hard">⭐⭐⭐ Hard</option>
                  </select>
                  <button type="submit" className="btn-primary whitespace-nowrap px-6 shadow-lg">Add Topic</button>
                </div>
              </form>

              <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 space-y-3">
                <AnimatePresence>
                  {topics.filter(t => t.subjectId === activeSubject).map(t => (
                    <motion.div key={t.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-dark-800/60 border border-dark-700/80 rounded-xl hover:border-dark-600 transition-colors group">
                      <div className="mb-3 md:mb-0">
                        <h4 className="font-medium text-lg leading-tight mb-2 group-hover:text-white transition-colors text-gray-200">{t.title}</h4>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium tracking-wide ${t.difficulty === 'Hard' ? 'bg-danger/10 text-danger border border-danger/20' : t.difficulty === 'Medium' ? 'bg-warning/10 text-warning border border-warning/20' : 'bg-success/10 text-success border border-success/20'}`}>
                          {t.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <select className="bg-dark-900 border border-dark-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-300 transition-all hover:bg-dark-800" value={t.status} onChange={(e) => updateTopic(t.id, { status: e.target.value })}>
                          <option value="Not Started" className="bg-dark-900">Not Started</option>
                          <option value="In Progress" className="bg-dark-900">In Progress</option>
                          <option value="Needs Revision" className="bg-dark-900">Needs Revision</option>
                          <option value="Completed" className="bg-dark-900">Completed</option>
                        </select>
                        <button onClick={() => deleteTopic(t.id)} className="text-dark-600 hover:text-danger bg-dark-900 hover:bg-danger/10 p-2 rounded-lg transition-colors"><FiTrash2 /></button>
                      </div>
                    </motion.div>
                  ))}
                  {topics.filter(t => t.subjectId === activeSubject).length === 0 && (
                     <motion.div initial={{ opacity:0 }} animate={{opacity:1}} className="text-center py-10 text-gray-500">
                        No topics assigned to this subject yet.
                     </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 bg-dark-800/30 rounded-xl border border-dashed border-dark-700">Select a subject to view its topics.</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
