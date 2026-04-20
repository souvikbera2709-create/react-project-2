import { useContext, useMemo } from 'react';
import { StudyContext } from '../context/StudyContext';

export const useProgress = () => {
  const { topics, subjects, tasks } = useContext(StudyContext);

  const subjectProgress = useMemo(() => {
    return subjects.map(subject => {
      const subjectTopics = topics.filter(t => t.subjectId === subject.id);
      const total = subjectTopics.length;
      const completed = subjectTopics.filter(t => t.status === 'Completed').length;
      return {
        name: subject.name,
        color: subject.color,
        completion: total === 0 ? 0 : Math.round((completed / total) * 100)
      };
    });
  }, [topics, subjects]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const overdue = tasks.filter(t => t.status === 'Overdue').length;
    return { total, completed, pending, overdue };
  }, [tasks]);

  const topicStats = useMemo(() => {
    return [
      { name: 'Completed', value: topics.filter(t => t.status === 'Completed').length, fill: '#10b981' },
      { name: 'In Progress', value: topics.filter(t => t.status === 'In Progress').length, fill: '#3b82f6' },
      { name: 'Needs Revision', value: topics.filter(t => t.status === 'Needs Revision').length, fill: '#f59e0b' },
      { name: 'Not Started', value: topics.filter(t => t.status === 'Not Started').length, fill: '#6b7280' }
    ];
  }, [topics]);

  return { subjectProgress, taskStats, topicStats };
};
