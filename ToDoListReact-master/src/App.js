import React, { useEffect, useState } from 'react';
import service, { setAuthToken } from './service.js';

// סגנונות עיצוב - נקי, מקצועי ומינימליסטי 
const globalStyles = `
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: #f8fafc;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #0f172a;
  }
  .app-container {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 480px;
    padding: 40px;
    box-sizing: border-box;
  }
  .header-title {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 24px;
    text-align: center;
  }
  .input-field {
    width: 100%;
    padding: 14px 16px;
    margin-bottom: 16px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 15px;
    transition: all 0.2s ease;
    box-sizing: border-box;
    background-color: #f8fafc;
  }
  .input-field:focus {
    outline: none;
    border-color: #3b82f6;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  .btn-primary {
    width: 100%;
    background-color: #0f172a;
    color: #ffffff;
    border: none;
    padding: 14px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .btn-primary:hover {
    background-color: #1e293b;
  }
  .link-text {
    color: #3b82f6;
    cursor: pointer;
    text-decoration: none;
    font-weight: 500;
  }
  .link-text:hover {
    text-decoration: underline;
  }
  .todo-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  .todo-title {
    font-size: 20px;
    font-weight: 600;
    color: #0f172a;
    margin: 0;
  }
  .btn-logout {
    background: transparent;
    color: #64748b;
    border: 1px solid #e2e8f0;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .btn-logout:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }
  .todo-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .todo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #f1f5f9;
  }
  .todo-item:last-child {
    border-bottom: none;
  }
  .todo-label-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .todo-checkbox {
    width: 18px;
    height: 18px;
    accent-color: #0f172a;
    cursor: pointer;
  }
  .todo-text {
    font-size: 15px;
    color: #334155;
    cursor: pointer;
    user-select: none;
  }
  .todo-item.completed .todo-text {
    color: #94a3b8;
    text-decoration: line-through;
  }
  .btn-delete {
    background: transparent;
    color: #cbd5e1;
    border: none;
    cursor: pointer;
    font-size: 16px;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
  .btn-delete:hover {
    color: #ef4444;
    background-color: #fef2f2;
  }
  .empty-state {
    text-align: center;
    color: #94a3b8;
    font-size: 14px;
    margin-top: 24px;
  }
`;

// 1. ההתחברות/הרשמה 
function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (isRegister) {
        await service.register(username, password);
        alert("Registration successful. You can now log in.");
        setIsRegister(false);
      } else {
        const response = await service.login(username, password);
        if (response.token) {
          onLogin(response.token);
        }
      }
    } catch (error) {
      alert("Error: Invalid credentials or user already exists.");
    }
  }

  return (
    <div className="app-container">
      <div className="header-title">
        {isRegister ? "Create an account" : "Sign in to your account"}
      </div>
      <form onSubmit={handleSubmit} style={{ direction: 'ltr' }}>
        <input 
          className="input-field"
          placeholder="Username" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          required 
        />
        <input 
          className="input-field"
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" className="btn-primary">
          {isRegister ? "Register" : "Sign in"}
        </button>
      </form>
      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
        {isRegister ? "Already have an account? " : "Don't have an account? "}
        <span className="link-text" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Sign in" : "Register"}
        </span>
      </div>
    </div>
  );
}

// 2. האפליקציה הראשית 
function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token")); 

  async function getTodos() {
    try {
      const fetchedTodos = await service.getTasks();
      setTodos(fetchedTodos);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      getTodos();
    }
  }, [token]);

  async function createTodo(e) {
    e.preventDefault();
    if(!newTodo.trim()) return;
    await service.addTask(newTodo);
    setNewTodo("");
    await getTodos();
  }

  async function updateCompleted(todo, isComplete) {
    await service.setCompleted(todo.id, isComplete);
    await getTodos();
  }

  async function deleteTodo(id) {
    await service.deleteTask(id);
    await getTodos();
  }

  function handleLogin(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    if(window.location.pathname === '/login') {
         window.location.href = '/';
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setAuthToken(null);
  }

  return (
    <>
      <style>{globalStyles}</style>
      
      {!token ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="app-container" style={{ direction: 'ltr' }}>
          <header className="todo-header">
            <h1 className="todo-title">Tasks</h1>
            <button className="btn-logout" onClick={handleLogout}>
              Sign out
            </button>
          </header>

          <form onSubmit={createTodo}>
            <input 
              className="input-field" 
              style={{ marginBottom: '24px' }}
              placeholder="Add a new task..." 
              value={newTodo} 
              onChange={(e) => setNewTodo(e.target.value)} 
            />
          </form>

          <section>
            <ul className="todo-list">
              {todos.map(todo => {
                return (
                  <li className={`todo-item ${todo.isComplete ? "completed" : ""}`} key={todo.id}>
                    <div className="todo-label-container">
                      <input 
                        className="todo-checkbox"
                        type="checkbox" 
                        checked={todo.isComplete} 
                        onChange={(e) => updateCompleted(todo, e.target.checked)} 
                      />
                      <span className="todo-text" onClick={() => updateCompleted(todo, !todo.isComplete)}>
                        {todo.name}
                      </span>
                    </div>
                    <button className="btn-delete" onClick={() => deleteTodo(todo.id)}>
                      ✕
                    </button>
                  </li>
                );
              })}
            </ul>
            {todos.length === 0 && (
              <div className="empty-state">
                No tasks to display.
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}

export default App;