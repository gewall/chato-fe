import axios from "axios";
import cookieParser from "./cookieParser";
import history from "./history";

const accessToken = cookieParser("access-token");
const refreshToken = cookieParser("refresh-token");

const instance = axios.create();
instance.defaults.baseURL = "http://localhost:4000/api";
instance.defaults.headers = {
  "Content-Type": "application/json",
};
instance.defaults.withCredentials = true;

instance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers = {
        authorization: accessToken,
      };
    }
    return config;
  },
  (err) => Promise.reject(err)
);

instance.interceptors.response.use(
  (resp) => resp,
  async (err) => {
    const config = err?.config;

    if (err.response?.status === 401 && !config._retry) {
      config._retry = true;
      try {
        await instance.post("/auth/refresh-token", {
          refreshToken,
        });
        // history.replace("/");
        return instance(config);
      } catch (error) {
        // history.replace("/auth");
        return Promise.reject(error);
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
