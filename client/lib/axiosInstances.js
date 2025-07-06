import axios from "axios";

export const axiosPublic = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: "http://localhost:4000/",
  withCredentials: true,
});
