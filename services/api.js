import axios from "axios";

const api = axios.create({
  // baseURL: "https://gentle-savannah-77998.herokuapp.com/",
  baseURL: "http://192.168.0.12:80",
});

export default api;
