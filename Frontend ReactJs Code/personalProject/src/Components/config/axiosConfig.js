import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:9999', // Ensure this matches your backend URL and port
//   headers: {
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*'
//   },
//   // withCredentials: true, // Needed if backend requires cookies for authentication
// });

// export default axiosInstance;


const axiosInstance = axios.create({
  baseURL: "https://localhost:7277/api",
});

// ✅ Automatically Attach Authorization Token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

 

 