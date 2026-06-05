import axios from "axios";

const api = axios.create({
  baseURL: "https://emigria-web-production.up.railway.app/api",
  timeout: 30000,
});
  
export default api;
