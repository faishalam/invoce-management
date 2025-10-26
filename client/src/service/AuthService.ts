import Axios from "axios";

const baseURL = "http://localhost:3001/";

export const AuthServices = Axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
