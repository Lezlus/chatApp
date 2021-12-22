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
    return axiosConfig.get(`http://127.0.0.1:8000/api/get-message-history/${messageHistoryId}`)
      .then(response => response.data)
      .catch(error => console.log(error))
  },
  getMessageHistoryMinifiedData: messageHistoryId => {
    return axiosConfig.get(`http://127.0.0.1:8000/api/get-message-history-minified/${messageHistoryId}`)
      .then(response => response.data)
      .catch(error => console.log(error))
  },
  createMessage: messageData => {
    return axiosConfig.post('http://127.0.0.1:8000/api/create-message/', messageData)
      .then(response => response.data)
      .catch(error => console.log(error))
  }
}

export default authService;