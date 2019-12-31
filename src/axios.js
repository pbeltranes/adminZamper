import axios from 'axios'
console.log('API:' + process.env.REACT_APP_API_URL)
const Axios = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  timeout: 10000,
  mode: "no-cors",
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json',
    'x-access-token': localStorage.getItem('token')
  }
})
export default Axios