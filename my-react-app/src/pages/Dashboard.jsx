import { useContext } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { useProgress } from '../hooks/useProgress';
import { StudyContext } from '../context/StudyContext';

export const Dashboard = () => {
  const { subjectProgress, taskStats, topicStats } = useProgress();
  const { revisions } = useContext(StudyContext);

  const pendingRevisions = revisions.filter(r => r.status === 'Pending').length;

  const statCards = [
    { title: 'Completed Tasks', value: taskStats.completed, icon: <FiCheckCircle size={24} className="text-success" />, trend: '+12%', bg: 'bg-success/10' },
    { title: 'Pending Tasks', value: taskStats.pending, icon: <FiClock size={24} className="text-warning" />, trend: 'Stable', bg: 'bg-warning/10' },
    { title: 'Pending Revisions', value: pendingRevisions, icon: <FiTrendingUp size={24} className="text-primary" />, trend: 'Requires action', bg: 'bg-primary/10' },
    { title: 'Overdue Tasks', value: taskStats.overdue, icon: <FiAlertCircle size={24} className="text-danger" />, trend: '-2%', bg: 'bg-danger/10' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20 md:pb-0">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Dashboard</h1>
          <p className="text-gray-400 mt-1">Here's your learning progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }} className="glass-panel p-6 flex flex-col justify-between group hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>{stat.icon}</div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-dark-700 text-gray-300">{stat.trend}</span>
            </div>
            <div>
              <div className="text-3xl font-bold font-sans tracking-tight mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.title}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Topic Breakdown */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center"><span className="w-2 h-6 bg-primary rounded-full mr-3"></span>Topic Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topicStats} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {topicStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80 transition-opacity cursor-pointer" />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#3C3C3C', borderRadius: '8px' }} itemStyle={{ color: '#E5E7EB' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {topicStats.map(stat => (
              <div key={stat.name} className="flex items-center text-sm">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: stat.fill }}></span>
                <span className="text-gray-300">{stat.name} ({stat.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Progress */}
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold mb-6 flex items-center"><span className="w-2 h-6 bg-secondary rounded-full mr-3"></span>Subject Completion %</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectProgress} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: '#2D2D2D' }} contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#3C3C3C', borderRadius: '8px' }} />
                <Bar dataKey="completion" radius={[4, 4, 0, 0]}>
                  {subjectProgress.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
