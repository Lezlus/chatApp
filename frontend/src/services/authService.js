import axios from 'axios';

const axiosConfig = axios.create({
  baseUrl: 'http://127.0.0.1:8000/api/'
})

const authService = {
  getData: userId => {
    return axios.get(`http://127.0.0.1:8000/api/get-users/${userId}/`)
      .then(response => response.data)
      .catch(error => console.log(error))
  },
  getMessageHistoryData: messageHistoryId => {
    let config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    }
    return axiosConfig.get(`http://127.0.0.1:8000/api/get-message-history/${messageHistoryId}`, config)
      .then(response => response.data)
      .catch(error => console.log(error))
  },
  getMessageHistoryMinifiedData: messageHistoryId => {
    return axiosConfig.get(`http://127.0.0.1:8000/api/get-message-history-minified/${messageHistoryId}`)
      .then(response => response.data)
      .catch(error => console.log(error))
  },
  createMessage: messageData => {
    let config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    }
    return axiosConfig.post('http://127.0.0.1:8000/api/create-message/', messageData, config)
      .then(response => response.data)
      .catch(error => console.log(error))
  },
  getAuthUserWithToken: () => {
    let config = {
      headers: {
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    }
    return axios.get('http://127.0.0.1:8000/api/current-user/', config)
      .then(response => response.data)
      .catch(error => error)
  },
  loginAuthUser: data => {
    return axios.post('http://127.0.0.1:8000/api/token-auth/', data)
      .then(response => response.data)
      .catch(error => console.log(error))
  },
  registerUser: data => {
    return axios.post('http://127.0.0.1:8000/api/create-user/', data)
      .then(response => response.data)
      .catch(error => console.log(error))
  },
}

export default authService;