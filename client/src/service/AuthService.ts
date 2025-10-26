import Axios from "axios";

const baseURL = "http://54.179.69.192/";

export const AuthServices = Axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
