import axios from 'axios';

class HttpService {
  static send(request) {
    return axios(request);
  }
}

export default HttpService;
