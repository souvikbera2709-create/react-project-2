import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { StudyContext } from '../context/StudyContext';
import { useTasks } from '../hooks/useTasks';
import { FiSearch, FiFilter, FiCheck, FiX, FiClock, FiPlusCircle, FiCheckSquare } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const taskSchema = yup.object().shape({
  topicId: yup.string().required('Topic is required'),
  title: yup.string().required('Task title is required').min(3),
  priority: yup.string().required(),
  dueDate: yup.string().required('Due date is required')
});

export const Tasks = () => {
  const { addTask, updateTask, deleteTask, topics, subjects } = useContext(StudyContext);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [sortParam, setSortParam] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredTasks = useTasks(activeTab, search, sortParam, priorityFilter, null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(taskSchema)
  });

  const onSubmit = (data) => {
    addTask(data);
    reset();
    setShowForm(false);
  };

  const getPriorityColor = (p) => p === 'High' ? 'text-danger bg-danger/10 border-danger/20' : p === 'Medium' ? 'text-warning bg-warning/10 border-warning/20' : 'text-success bg-success/10 border-success/20';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 flex flex-col h-full h-[calc(100vh-100px)] lg:h-[calc(100vh-120px)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-warning to-danger">Task Board</h1>
          <p className="text-gray-400 mt-1">Organize and track your study milestones</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary shadow-xl font-semibold flex items-center px-5">
           <FiPlusCircle className="mr-2" size={20} /> New Task
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-6 bg-dark-800/90 border border-primary/30">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Topic</label>
                  <select {...register('topicId')} className="input-field bg-dark-900 border-dark-600">
                    <option value="">Select Topic...</option>
                    {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                  <p className="text-danger text-xs mt-1">{errors.topicId?.message}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Task Title</label>
                  <input {...register('title')} placeholder="Read chapter 4..." className="input-field bg-dark-900 border-dark-600" />
                  <p className="text-danger text-xs mt-1">{errors.title?.message}</p>
                </div>
                <div>
                   <label className="block text-sm text-gray-400 mb-2">Priority</label>
                   <select {...register('priority')} className="input-field bg-dark-900 border-dark-600">
                      <option value="High">High</option>
                      <option value="Medium" selected>Medium</option>
                      <option value="Low">Low</option>
                   </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Due Date</label>
                  <input type="date" {...register('dueDate')} className="input-field bg-dark-900 border-dark-600" />
                  <p className="text-danger text-xs mt-1">{errors.dueDate?.message}</p>
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-4">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-gray-400 hover:text-white transition-colors font-medium">Cancel</button>
                <button type="submit" className="btn-primary px-6 shadow-md border border-primary/50">Save Task</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-panel flex flex-col flex-1 overflow-hidden shadow-2xl border-dark-700/60">
        <div className="border-b border-dark-700 p-2 md:p-4 bg-dark-800/50 flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex overflow-x-auto hide-scrollbar space-x-1 p-1 bg-dark-900 rounded-xl max-w-max border border-dark-700/50">
            {['All', 'Pending', 'Completed', 'Overdue'].map(tab => (
              <button 
                key={tab} 
                className={`py-2 px-5 rounded-lg text-sm font-medium transition-all duration-300 relative ${activeTab === tab ? 'text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800'}`}
                onClick={() => setActiveTab(tab)}
              >
                {activeTab === tab && <motion.div layoutId="tabMarker" className="absolute inset-0 bg-dark-700 border border-dark-600 rounded-lg -z-10 shadow-inner"></motion.div>}
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
             <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input type="text" placeholder="Search tasks..." className="input-field pl-10 h-10 w-full lg:w-48 bg-dark-900 focus:bg-dark-800 transition-colors" value={search} onChange={e => setSearch(e.target.value)} />
             </div>
             <div className="flex h-10 rounded-lg bg-dark-900 border border-dark-600 p-1">
                <select className="bg-transparent border-none text-sm text-gray-300 focus:outline-none px-2" value={sortParam} onChange={e => setSortParam(e.target.value)}>
                   <option value="">Sort: Default</option>
                   <option value="dueDate">Sort: Due Date</option>
                </select>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-dark-900/30">
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredTasks.map(task => (
                <motion.div key={task.id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-dark-800 border border-dark-700 rounded-xl p-5 hover:border-dark-500 transition-all hover:shadow-xl hover:shadow-black/20 group">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getPriorityColor(task.priority)}`}>{task.priority} Priority</span>
                    <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-md ${task.status === 'Completed' ? 'bg-success/20 text-success' : task.status === 'Overdue' ? 'bg-danger/20 text-danger' : 'bg-dark-700 text-gray-300'}`}>
                      {task.status === 'Completed' && <FiCheck className="mr-1" />}
                      {task.status === 'Overdue' && <FiClock className="mr-1" />}
                      {task.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 group-hover:text-primary transition-colors leading-tight mb-2">{task.title}</h3>
                  <div className="flex items-center mb-5 text-sm">
                     <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: task.subject?.color || '#3b82f6' }}></div>
                     <span className="text-gray-400 font-medium">{task.topic?.title || 'Unknown Topic'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-dark-700 pt-4 mt-auto">
                    <span className="text-xs text-gray-500 flex items-center bg-dark-900 px-2 py-1 rounded-md border border-dark-800"><FiClock className="mr-1.5" /> Due: {task.dueDate}</span>
                    <div className="flex gap-2">
                       {task.status !== 'Completed' && (
                         <button onClick={() => updateTask(task.id, { status: 'Completed' })} className="w-8 h-8 flex items-center justify-center rounded-lg bg-success/10 text-success hover:bg-success hover:text-white transition-colors tooltip"><FiCheck /></button>
                       )}
                       <button onClick={() => deleteTask(task.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-700 text-gray-400 hover:bg-danger hover:text-white transition-colors"><FiX /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredTasks.length === 0 && (
                <div className="col-span-full py-20 flex flex-col justify-center items-center text-gray-500">
                   <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center mb-4 border border-dark-700 border-dashed"><FiCheckSquare size={32} className="opacity-40" /></div>
                   <p className="text-lg">No tasks found in this view.</p>
                </div>
              )}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
