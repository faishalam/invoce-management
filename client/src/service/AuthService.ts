import Axios from "axios";

const baseURL = "https://beritaacaramanagement.cloud/";
// const baseURL = "http://localhost:3001/";
export const AuthServices = Axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
