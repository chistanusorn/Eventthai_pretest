import axios from 'axios';

const api = axios.create({
  baseURL: 'https://reqres.in/api', // <-- Uncomment this line (and comment the one below) to use Real API (VPN/Hotspot required)
  //baseURL: '/api', // <-- Current: Local Mock (Use this if blocked)
  headers: {
    'Content-Type': 'application/json',
    ...(process.env.NEXT_PUBLIC_REQRES_API_KEY && { 'x-api-key': process.env.NEXT_PUBLIC_REQRES_API_KEY }),
  },
});

export default api;
