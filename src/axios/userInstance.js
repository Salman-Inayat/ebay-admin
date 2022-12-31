import axios from "axios";
import { getToken } from "src/store/localStorage";

const userInstance = axios.create({
  baseURL: `${process.env.REACT_APP_DEV_API_URL}/user`,
});

userInstance.interceptors.request.use(
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

export default userInstance;
