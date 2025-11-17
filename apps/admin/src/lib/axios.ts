// libs/axios.ts
import axios from "axios";


const api = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
withCredentials: true,
headers: {
"Content-Type": "application/json"
}
});


// Automatically refresh token on 401
api.interceptors.response.use(
(res) => res,
async (err) => {
if (err.response?.status === 401) {
try {
await api.get("/auth/refresh");
return api(err.config);
} catch {
return Promise.reject(err);
}
}
return Promise.reject(err);
}
);


export default api;