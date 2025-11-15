import axios from 'axios';
import { Alert, Platform } from 'react-native';
import ApiPath from '../constants/ApiPath';
import { APIResponse } from '../models/apiResponse';
import { customLog } from '../utils/CustomConsole';
import { getToken, signOut } from './auth';
import * as router from 'react-native-router-flux';
import { ROUTE } from '../constants/RoutePath';
import FormData from 'form-data';
import moment from 'moment';

const api = axios.create({
  baseURL: ApiPath.baseUrl,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

api.interceptors.request.use(
  async config => {
    customLog(
      `Request >>>> Method: ${config.method} | Path: ${JSON.stringify(
        config.url,
      )}`,
      'info',
    );
    if (config.data instanceof FormData) {
      customLog(`Request >>>> Form Data Method: 
          ${JSON.stringify(config)}`);
    }
    // customLog(`Request >>>> Method:`)
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
      `Response >>>> Status: ${response.status} | Data: ${JSON.stringify(
        response.data,
      )}`,
      'info',
    );
    return response;
  },
  error => {
    console.log('[error] ====>', error);
    if (
      error.request._hasError === true &&
      error.request._response.includes('connect')
    ) {
      Alert.alert('Failed', 'No internet connect', [{ text: 'ตกลง' }], {
        cancelable: false,
      });
    }

    if (error.response.status === 401) {
      Alert.alert('Failed', 'ไม่ได้รับอะนุญาตให้เชื่อมต่อ', [{ text: 'ตกลง' }], {
        cancelable: false,
      });

      // signOut();

      // router.Actions.replace(ROUTE.LOGIN);
    }

    return Promise.reject(error);
  },
);

export const uploadImage = async (file: any, order_id: string) => {
  if (file.fileName) {
    const y = moment().year();
    const m = moment.months();

    const formdata = new FormData();
    formdata.append('file', {
      name: file.fileName,
      type: file.type,
      uri: file.uri,
    });
    // formdata.append('order_id', order_id);
    console.log('[formdata]', formdata);
    const response = await api.post<APIResponse<any>>(
      `${ApiPath.upload}?order_id=${order_id}`,
      formdata,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } else {
    return null;
  }
};
export const uploadImageNas = async (file: any, order_id: string, tradCode: string, orderType: string) => {
  if (file.fileName) {
    const y = moment().year();
    const m = moment().month()+1; // เดือนปัจจุบัน (1-12)
    // Alert.alert(m.toString());
    try {
      const formdata = new FormData();
      formdata.append('image', {
        name: file.fileName,
        type: file.type,
        uri: file.uri,
      });
      formdata.append('tradCode', tradCode);
      formdata.append('orderType', orderType);
      formdata.append('year', y.toString());
      formdata.append('month', m.toString());
      formdata.append('orderId', order_id);
      console.log('[formdata]', formdata);
      // formdata.append("image", fileInput.files[0], "/C:/Users/Devakam-Admin/Downloads/ปชช คุณสุพัตรา (1).jpg");

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
      };

      const response = await fetch(ApiPath.uploadNas, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
        // console.log(response);
      return response;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }

  } else {
    return null;
  }
};
export const uploadImageNas_bak = async (file: any, order_id: string, tradCode: string, orderType: string) => {
  if (file.fileName) {
    const y = moment().year();
    const m = moment().month() + 1; // เดือนปัจจุบัน (1-12)

    try {

      const formdata = new FormData();
      formdata.append('image', {
        name: file.fileName,
        type: file.type,
        uri: file.uri,
      });
      formdata.append('tradCode', tradCode);
      formdata.append('orderType', orderType);
      formdata.append('year', y.toString());
      formdata.append('month', m.toString);
      formdata.append('orderId', order_id);
      console.log('[formdata]', formdata);
      const response = await api.post<APIResponse<any>>(
        `${ApiPath.uploadNas}`,
        formdata
      );
      return response;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }

  } else {
    return null;
  }
};
export const uploadImage2 = async (file: any, order_id: string) => {
  if (file.fileName) {

    const formdata = new FormData();
    formdata.append('file', {
      name: file.fileName,
      type: file.type,
      uri: file.uri,
    });
    // formdata.append('order_id', order_id);
    console.log('[formdata]', formdata);
    const response = await api.post<APIResponse<any>>(
      `${ApiPath.upload}?order_id=${order_id}`,
      formdata,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response;
  } else {
    return null;
  }
};


export const uploadImageNew = async (file: any, order_id: string, imaStdId: number) => {
  if (file.fileName) {

    const formdata = new FormData();
    formdata.append('file', {
      name: file.fileName,
      type: file.type,
      uri: file.uri
    });
    // formdata.append('order_id', order_id);
    // console.log('formdata xxx', formdata);
    const response = await api.post<APIResponse<any>>(
      `${ApiPath.upload_newUrl}?orderId=${order_id}&imaStdId=${imaStdId}`,
      formdata,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response;
  } else {
    return null;
  }
};

export const uploadImageVisitInspect = async (file: any, order_id: string, workType: string) => {
  if (file.fileName) {
    const formdata = new FormData();
    formdata.append('file', {
      name: file.fileName,
      type: file.type,
      uri: file.uri,
    });
    // formdata.append('order_id', order_id);
    console.log('[formdata]', formdata);
    const response = await api.post<APIResponse<any>>(
      `${ApiPath.visit_inspector}?order_id=${order_id}&work_type=${workType}`,
      formdata,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } else {
    return null;
  }
};

export const removeImagesVisitInspector = async (url: any) => {
  const response = await api.get<APIResponse<any>>(
    `${ApiPath.remove_visit_inspector}?url=${url}`,
  );
};
