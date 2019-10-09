import axios from 'axios'

const Axios = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  // baseURL: 'https://api.kenosapp.com',
  timeout: 6000,
  mode: 'no-cors',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json',
    'x-access-token': localStorage.getItem('token')
  }
})

export default Axios