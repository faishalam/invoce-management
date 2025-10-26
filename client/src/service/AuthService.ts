import Axios from "axios";

const baseURL = "https://beritaacaramanagement.cloud/";

export const AuthServices = Axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
