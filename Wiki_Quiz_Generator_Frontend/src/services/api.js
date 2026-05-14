/**
 * API service for communicating with the backend using Axios.
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for quiz generation
});

/**
 * Generate a quiz from a Wikipedia URL
 * @param {string} url - Wikipedia article URL
 * @param {number} numQuestions - Number of questions to generate (default: 10)
 * @returns {Promise} Quiz data
 */
export const generateQuiz = async (url, numQuestions = 10) => {
  const response = await api.post('/generate-quiz', {
    url,
    num_questions: numQuestions,
  });
  return response.data;
};

/**
 * Get all past quizzes
 * @returns {Promise} List of quizzes
 */
export const getAllQuizzes = async () => {
  const response = await api.get('/quizzes');
  return response.data;
};

/**
 * Get quiz details by ID
 * @param {number} id - Quiz ID
 * @returns {Promise} Quiz details
 */
export const getQuizById = async (id) => {
  const response = await api.get(`/quizzes/${id}`);
  return response.data;
};

/**
 * Check API health
 * @returns {Promise} Health status
 */
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
