import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: `${API_URL}/api`,
});

export default client;