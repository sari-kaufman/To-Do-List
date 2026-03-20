import axios from 'axios';

// הגדרת הכתובת של ה-API 
axios.defaults.baseURL = "http://localhost:5035";

// פונקציה מיוחדת שמוסיפה את הטוקן לכל הבקשות שלנו לשרת
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// הוספת interceptor שתופס שגיאת 401 ומעביר לדף לוגין
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login'; // זורק את המשתמש לדף ההתחברות
    }
    console.error("Axios Error Caught:", error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export default {
  getTasks: async () => {
    const result = await axios.get(`/items`)    
    return result.data;
  },

  addTask: async(name)=>{
    console.log('addTask', name)
    const result = await axios.post(`/items`, { name: name, isComplete: false })
    return result.data;
  },

  setCompleted: async(id, isComplete)=>{
    console.log('setCompleted', {id, isComplete})
    const result = await axios.put(`/items/${id}`, { id: id, isComplete: isComplete, name: "Task" }) 
    return result.data;
  },

  deleteTask:async(id)=>{
    console.log('deleteTask')
    const result = await axios.delete(`/items/${id}`)
    return result.data;
  },

  // פונקציות עבור ההרשמה וההתחברות 
  
  register: async (username, password) => {
    const result = await axios.post('/register', { username, password });
    return result.data;
  },

  login: async (username, password) => {
    const result = await axios.post('/login', { username, password });
    return result.data;
  }
};