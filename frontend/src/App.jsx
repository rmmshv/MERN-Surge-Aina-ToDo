import React, { useEffect, useState } from "react";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import axios from "axios";

function App() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post(`${API_URL}/api/todos`, { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.log("Error adding todo:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/todos`);
      setTodos(response.data);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/api/todos/${id}`, {
        text: editedText,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setEditingTodo(null);
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const response = await axios.patch(`${API_URL}/api/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t._id === id ? response.data : t)));
    } catch (error) {
      console.log("Error toggling todo:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Surge Aina To Do App
        </h1>

        <form
          onSubmit={addTodo}
          className="flex items-center gap-2 border border-gray-200 p-3 rounded-xl bg-gray-50"
        >
          <input
            className="flex-1 outline-none px-4 py-2 text-gray-700 placeholder-gray-400 rounded-full bg-white border border-gray-100 focus:ring-2 focus:ring-gray-300 transition"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition"
          >
            Add
          </button>
        </form>

        <div className="mt-8">
          {todos.length === 0 ? (
            <div className="text-center text-gray-400 italic py-8">
              No tasks yet. Add your first one!
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className={`rounded-xl px-4 py-3 flex items-center justify-between shadow-sm border transition-colors ${
                    todo.completed
                      ? "bg-green-50 border-green-100"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {editingTodo === todo._id ? (
                    <div className="flex items-center gap-x-3 w-full">
                      <input
                        className="flex-1 p-2 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner"
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                      <div className="flex gap-x-2">
                        <button
                          onClick={() => saveEdit(todo._id)}
                          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
                          title="Save"
                        >
                          <MdOutlineDone />
                        </button>
                        <button
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer"
                          onClick={() => setEditingTodo(null)}
                          title="Cancel"
                        >
                          <IoClose />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-x-4 overflow-hidden flex-1">
                        <button
                          onClick={() => toggleTodo(todo._id)}
                          className={`flex-shrink-0 h-7 w-7 border-2 rounded-full flex items-center justify-center transition ${
                            todo.completed
                              ? "bg-green-400 border-green-400 text-black"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          title="Toggle complete"
                        >
                          {todo.completed && <MdOutlineDone />}
                        </button>
                        <span
                          className={`truncate font-medium text-lg ${
                            todo.completed
                              ? "line-through text-gray-400"
                              : "text-gray-800"
                          }`}
                        >
                          {todo.text}
                        </span>
                      </div>
                      <div className="flex gap-x-2">
                        <button
                          className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-100 duration-200"
                          onClick={() => startEditing(todo)}
                          title="Edit"
                        >
                          <MdModeEditOutline />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo._id)}
                          className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-100 duration-200"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;