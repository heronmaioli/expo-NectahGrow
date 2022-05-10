import axios from 'axios';
import { API_ADDRESS_LOCAL, API_ADDRESS_PRODUCTION } from 'react-native-dotenv';

const api = axios.create({
  // baseURL: API_ADDRESS_PRODUCTION,
  baseURL: API_ADDRESS_LOCAL,
});

export default api;
