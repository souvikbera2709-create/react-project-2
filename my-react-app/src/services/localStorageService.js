import { v4 as uuidv4 } from 'uuid';
import { addDays, format } from 'date-fns';

const MOCK_SUBJECTS = [
  { id: '1', name: 'Computer Science', color: '#6366f1' },
  { id: '2', name: 'Mathematics', color: '#8b5cf6' },
  { id: '3', name: 'Physics', color: '#10b981' }
];

const MOCK_TOPICS = [
  { id: '101', subjectId: '1', title: 'Data Structures', difficulty: 'Hard', status: 'In Progress' },
  { id: '102', subjectId: '1', title: 'Algorithms', difficulty: 'Hard', status: 'Needs Revision' },
  { id: '103', subjectId: '2', title: 'Linear Algebra', difficulty: 'Medium', status: 'Completed' },
  { id: '104', subjectId: '3', title: 'Quantum Mechanics', difficulty: 'Hard', status: 'Not Started' }
];

const MOCK_TASKS = [
  { id: '201', topicId: '101', title: 'Implement AVL Tree', priority: 'High', dueDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'), status: 'Pending' },
  { id: '202', topicId: '103', title: 'Solve Matrix problems', priority: 'Medium', dueDate: format(addDays(new Date(), -1), 'yyyy-MM-dd'), status: 'Overdue' },
  { id: '203', topicId: '102', title: 'Review Sorting Algorithms', priority: 'Low', dueDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'), status: 'Completed' }
];

const MOCK_REVISIONS = [
  { id: '301', topicId: '103', scheduledDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'), status: 'Pending' }
];

// Local Storage Helper
export const storage = {
  get: (key, defaultValue) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  },
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const initializeMockData = () => {
  if (!localStorage.getItem('subjects')) storage.set('subjects', MOCK_SUBJECTS);
  if (!localStorage.getItem('topics')) storage.set('topics', MOCK_TOPICS);
  if (!localStorage.getItem('tasks')) storage.set('tasks', MOCK_TASKS);
  if (!localStorage.getItem('revisions')) storage.set('revisions', MOCK_REVISIONS);
};

export const getSubjects = () => storage.get('subjects', []);
export const saveSubjects = (subjects) => storage.set('subjects', subjects);

export const getTopics = () => storage.get('topics', []);
export const saveTopics = (topics) => storage.set('topics', topics);

export const getTasks = () => storage.get('tasks', []);
export const saveTasks = (tasks) => storage.set('tasks', tasks);

export const getRevisions = () => storage.get('revisions', []);
export const saveRevisions = (revisions) => storage.set('revisions', revisions);
