import apiClient from "./services.js";

const todoServices = {
  getTodos(listId) {
    return apiClient.get(`lists/${listId}/todos`);
  },

  createTodo(listId, title, dueDate = null) {
    const body = { title };
    if (dueDate) {
      body.dueDate = dueDate;
    }
    return apiClient.post(`lists/${listId}/todos`, body);
  },

  updateTodo(todoId, payload) {
    return apiClient.put(`todos/${todoId}`, payload);
  },

  deleteTodo(todoId) {
    return apiClient.delete(`todos/${todoId}`);
  },
};

export default todoServices;
