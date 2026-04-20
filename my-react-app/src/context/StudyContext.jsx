import { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addDays, format, parseISO } from 'date-fns';
import { 
  getSubjects, saveSubjects, 
  getTopics, saveTopics, 
  getTasks, saveTasks, 
  getRevisions, saveRevisions,
  initializeMockData
} from '../services/localStorageService';

export const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [revisions, setRevisions] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    initializeMockData();
    setSubjects(getSubjects());
    setTopics(getTopics());
    setTasks(getTasks());
    setRevisions(getRevisions());
  }, []);

  // Sync to local storage when state changes
  useEffect(() => {
    if (subjects.length > 0) saveSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    if (topics.length > 0) saveTopics(topics);
  }, [topics]);

  useEffect(() => {
    if (tasks.length > 0) saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    if (revisions.length > 0) saveRevisions(revisions);
  }, [revisions]);

  // Actions
  const addSubject = (subject) => setSubjects([...subjects, { ...subject, id: uuidv4() }]);
  const updateSubject = (id, updatedData) => setSubjects(subjects.map(s => s.id === id ? { ...s, ...updatedData } : s));
  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setTopics(topics.filter(t => t.subjectId !== id)); // Cascade delete
  };

  const addTopic = (topic) => setTopics([...topics, { ...topic, id: uuidv4(), status: 'Not Started' }]);
  
  const updateTopic = (id, updatedData) => {
    setTopics(topics.map(t => {
      if (t.id === id) {
        const newTopic = { ...t, ...updatedData };
        // If marked Completed, schedule a revision 3 days from now
        if (updatedData.status === 'Completed' && t.status !== 'Completed') {
          scheduleRevision(id);
        }
        return newTopic;
      }
      return t;
    }));
  };
  
  const deleteTopic = (id) => setTopics(topics.filter(t => t.id !== id));

  const addTask = (task) => setTasks([...tasks, { ...task, id: uuidv4(), status: 'Pending' }]);
  const updateTask = (id, updatedData) => setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedData } : t));
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  const scheduleRevision = (topicId) => {
    const newRevision = {
      id: uuidv4(),
      topicId,
      scheduledDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
      status: 'Pending'
    };
    setRevisions([...revisions, newRevision]);
  };

  const updateRevision = (id, updatedData) => setRevisions(revisions.map(r => r.id === id ? { ...r, ...updatedData } : r));
  const deleteRevision = (id) => setRevisions(revisions.filter(r => r.id !== id));

  return (
    <StudyContext.Provider value={{
      subjects, addSubject, updateSubject, deleteSubject,
      topics, addTopic, updateTopic, deleteTopic,
      tasks, addTask, updateTask, deleteTask,
      revisions, updateRevision, deleteRevision
    }}>
      {children}
    </StudyContext.Provider>
  );
};
