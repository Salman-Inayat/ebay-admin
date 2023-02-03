import axios from "axios";
import { getToken } from "src/store/localStorage";
const botInstance = axios.create({
  baseURL: `${process.env.REACT_APP_DEV_API_URL}/bot`,
});

botInstance.interceptors.request.use(
  async (config) => {
    config.headers = {
      Authorization: `Bearer ${getToken()}`,
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default botInstance;
