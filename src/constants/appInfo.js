import js from '../data/js.json';
import html from '../data/html.json';
import python from '../data/python.json';
import sql from '../data/sql.json';

export const APP_NAME = 'Quizzical';
export const CATEGORIES = ['Business', 'Entertainment', 'General', 'Health', 'Science', 'Sports', 'Technology'];
export const DEMO_QUIZZES = [
  { id: 1, title: 'Python Quiz', questions: python },
  { id: 2, title: 'JavaScript Quiz', questions: js },
  { id: 3, title: 'HTML Quiz', questions: html },
  { id: 4, title: 'SQL Quiz', questions: sql }
]