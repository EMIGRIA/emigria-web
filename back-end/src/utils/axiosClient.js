import axios from 'axios';

// Create a simple, pre-configured Axios instance for all external API calls
const axiosClient = axios.create({
  timeout: 15000, // Abort request if it takes longer than 15 seconds
  headers: {
    'User-Agent': 'Emigria-Backend/1.0',
  }
});

export default axiosClient;
