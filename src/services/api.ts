import axios from 'axios';
import { Alert } from 'react-native';
// import * as router from 'react-native-router-flux';
import ApiPath from '../constants/ApiPath';
import { ROUTE } from '../constants/RoutePath';
import { APIResponse } from '../models/apiResponse';
import { LoginResponseInterface } from '../models/login';
import { customLog } from '../utils/CustomConsole';
import { getUser } from '../utils/helper';
import { getToken, signOut } from './auth';

const api = axios.create({
  baseURL: ApiPath.baseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 1000 * 60,
});

api.interceptors.request.use(
  async config => {
    const user: LoginResponseInterface = await getUser();
    customLog(
      `Request |role: ${user.role}| >>>> Method: ${
        config.method
      } | Path: ${JSON.stringify(config.url)}`,
      'info',
    );
    if (config.method === 'GET' || config.method === 'get') {
      console.log(
        `Request | Path: ${JSON.stringify(config.url)} >>>> Param:`,
        JSON.stringify(config.params, null, 2),
      );
    } else if (config.method === 'PATCH' || config.method === 'PUT') {
      console.log(
        `Request | Path: ${JSON.stringify(config.url)} >>>> Param:`,
        JSON.stringify(config.params, null, 2),
      );
      console.log('Request >>>> Body:', JSON.stringify(config.data, null, 2));
    } else {
      console.log('Request >>>> Body:', JSON.stringify(config.data, null, 2));
    }
    return getToken()
      .then(token => {
        if (token) config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
        return Promise.resolve(config);
      })
      .catch(error => {
        console.log('[Request error] ====>', error);
        return Promise.resolve(config);
      });
  },
  error => {
    console.log('[Request error] ====>', error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    customLog(
      `Response | Path: ${JSON.stringify(response.config.url)} >>>> Status: ${
        response.status
      } | Data: ${JSON.stringify(response.data)}`,
      'info',
    );
    return response;
  },
  error => {
    if (error.message === 'Network Error') {
      // signOut();
      // router.Actions.replace(ROUTE.LOGIN);
      // Alert.alert('Failed','เกิดปัญหาการเชื่อมต่อ',[{text:'ตกลง'}]);
      return;
    }
    if (
      error.request._hasError === true &&
      error.request._response.includes('connect')
    ) {
      Alert.alert('Failed', 'No internet connect', [{ text: 'ตกลง' }], {
        cancelable: false,
      });
    }

    if (error.response.status === 401) {
      //   Alert.alert('Failed', 'Token Expired', [{ text: 'ตกลง'}], {
      //   cancelable: false,
      // });

      signOut();

      // router.Actions.replace(ROUTE.LOGIN);
    }

    return Promise.reject(error);
  },
);

export default api;

export const whoAmI = async () => {
  const response = await api.get<APIResponse>(ApiPath.me);
  return response.data.dataResult;
};
