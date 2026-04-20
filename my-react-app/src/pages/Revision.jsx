import { useContext } from 'react';
import { StudyContext } from '../context/StudyContext';
import { FiRefreshCw, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export const Revision = () => {
  const { revisions, topics, subjects, updateRevision, deleteRevision } = useContext(StudyContext);

  const getTopicDetails = (topicId) => {
    const topic = topics.find(t => t.id === topicId);
    const subject = topic ? subjects.find(s => s.id === topic.subjectId) : null;
    return { topic, subject };
  };

  const markRevisionDone = (id) => updateRevision(id, { status: 'Completed' });

  const pendingRevisions = revisions.filter(r => r.status === 'Pending').sort((a,b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  const completedRevisions = revisions.filter(r => r.status === 'Completed').slice(-5); // View last 5

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-info to-primary flex items-center">
            <FiRefreshCw className="mr-3 text-info drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" /> Auto-Scheduler
        </h1>
        <p className="text-gray-400 mt-2 text-lg">AI-spaced repetition prompts based on completed topics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Pending Revisions</h2>
            <AnimatePresence>
               {pendingRevisions.map(rev => {
                  const { topic, subject } = getTopicDetails(rev.topicId);
                  if(!topic) return null;
                  return (
                     <motion.div key={rev.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-panel p-5 border-l-4 group relative overflow-hidden" style={{ borderLeftColor: subject?.color || '#3b82f6' }}
                     >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                           <div>
                              <div className="flex items-center space-x-2 mb-1">
                                 <span className="text-xs font-semibold px-2 py-1 bg-dark-800 rounded border border-dark-700 text-gray-400 shadow-inner">{subject?.name}</span>
                                 <span className="text-xs text-info font-medium tracking-wider">DTC: {rev.scheduledDate}</span>
                              </div>
                              <h3 className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors">{topic.title}</h3>
                              <p className="text-sm text-gray-400 mt-1.5 flex items-center"><FiRefreshCw className="mr-1.5" size={14} /> Scheduled 3 days after completion.</p>
                           </div>
                           <button onClick={() => markRevisionDone(rev.id)} className="btn-primary whitespace-nowrap px-6 py-2.5 flex items-center justify-center font-bold tracking-wide group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all">
                              <FiCheckCircle className="mr-2" /> Mark Revised
                           </button>
                        </div>
                     </motion.div>
                  );
               })}
               {pendingRevisions.length === 0 && (
                  <div className="glass-panel p-10 text-center text-gray-500 border border-dark-700 border-dashed">
                     Your revision queue is empty. Great job staying caught up!
                  </div>
               )}
            </AnimatePresence>
         </div>

         <div>
            <div className="glass-panel p-6 bg-dark-800/60 sticky top-24 border border-dark-700/50 relative overflow-hidden">
               <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-success/10 rounded-full blur-3xl"></div>
               <h2 className="text-lg font-semibold mb-4 text-gray-300 relative z-10">Recently Completed</h2>
               <div className="space-y-4 relative z-10">
                  {completedRevisions.map(rev => {
                     const { topic } = getTopicDetails(rev.topicId);
                     return (
                        <div key={rev.id} className="flex items-start space-x-3 text-sm opacity-70 hover:opacity-100 transition-opacity group/rev">
                           <FiCheckCircle className="text-success mt-1 flex-shrink-0" />
                           <div className="flex-1">
                              <div className="font-medium text-gray-300">{topic?.title || 'Deleted Topic'}</div>
                              <div className="text-xs text-gray-500">{rev.scheduledDate}</div>
                           </div>
                           <button onClick={() => deleteRevision(rev.id)} className="text-gray-500 hover:text-danger opacity-0 group-hover/rev:opacity-100 transition-opacity p-1 rounded hover:bg-danger/10" title="Delete record">
                              <FiTrash2 size={14} />
                           </button>
                        </div>
                     );
                  })}
                  {completedRevisions.length === 0 && <span className="text-sm text-gray-500">No recent revisions.</span>}
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
};
