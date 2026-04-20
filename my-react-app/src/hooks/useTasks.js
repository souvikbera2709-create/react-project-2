import { useContext, useMemo } from 'react';
import { StudyContext } from '../context/StudyContext';

export const useTasks = (filterTab, searchQuery, sortBy, priorityFilter, subjectFilter) => {
  const { tasks, topics, subjects } = useContext(StudyContext);

  const processedTasks = useMemo(() => {
    let result = [...tasks];

    // Filter by Tab
    if (filterTab === 'Pending') result = result.filter(t => t.status === 'Pending');
    if (filterTab === 'Completed') result = result.filter(t => t.status === 'Completed');
    if (filterTab === 'Overdue') result = result.filter(t => t.status === 'Overdue');
    // Note: 'Revision' tab handling could be done via `revisions` state, but let's stick to simple task filters here for the "Task" board hook.

    // Enrich task with Topic and Subject details
    result = result.map(t => {
      const topic = topics.find(tp => tp.id === t.topicId);
      const subject = topic ? subjects.find(s => s.id === topic.subjectId) : null;
      return { ...t, topic, subject };
    });

    // Search Query
    if (searchQuery) {
      result = result.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (t.topic?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filters
    if (priorityFilter) result = result.filter(t => t.priority === priorityFilter);
    if (subjectFilter) result = result.filter(t => t.subject?.id === subjectFilter);

    // Sort
    if (sortBy === 'dueDate') {
      result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    return result;
  }, [tasks, topics, subjects, filterTab, searchQuery, sortBy, priorityFilter, subjectFilter]);

  return processedTasks;
};
