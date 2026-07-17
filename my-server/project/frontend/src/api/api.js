import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});
export const getMenu = () => api.get('/menu');
export const createOrder = (dishIds) => api.post('/order', { dishIds });
export const getCategories = () => api.get('/categories');
export const getCategoryById = (id) => api.get(`/categories/${id}`);
export const createCategory = (name) => api.post('/categories', { name });
export const updateCategory = (id, name) => api.put(`/categories/${id}`, { name });
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
export const getDishes = () => api.get('/dishes');
export const getDishById = (id) => api.get(`/dishes/${id}`);
export const createDish = (data) => api.post('/dishes', data);
export const updateDish = (id, data) => api.put(`/dishes/${id}`, data);
export const deleteDish = (id) => api.delete(`/dishes/${id}`);

export default api;
