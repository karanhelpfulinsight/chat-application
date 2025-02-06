import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // this is important for cookies
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // No need to manually set cookies in headers - axios will handle this
    console.log('Request:', config);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response || error);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          console.error('Unauthorized, please login!');
          break;
        case 403:
          // Handle forbidden
          console.error('Forbidden access!');
          break;
        case 500:
          console.error('Server error, please try again later!');
          break;
        default:
          console.error('An error occurred!');
      }
    }

    return Promise.reject(error);
  }
);

export default api;