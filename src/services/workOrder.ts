import RNFetchBlob from 'rn-fetch-blob';
import ApiPath from '../constants/ApiPath';
import { APIResponse } from '../models/apiResponse';
import { IWorkOrder } from '../models/WorkOrder';
import { IWorkOrderDetail } from '../models/WorkOrderDetail';
import api from './api';
import RNFS from 'react-native-fs';
import { PermissionsAndroid, Platform } from 'react-native';
// import RNBlobUtil from 'react-native-blob-util';

export const fetchWorkOrderList = async (wk_ctr: string = '', Page = 1, Limit = 5) => {
  return await api.get<APIResponse<IWorkOrder[]>>(ApiPath.workOrderList, { params: { wk_ctr, Page, Limit } })
};


export const fetchWorkOrderDetail = async (order_id: string) => {
  console.log('[orderId]', order_id)
  const response = await api.get<APIResponse<IWorkOrderDetail>>(ApiPath.workOrderDetail, { params: {order_id} })
  return response.data
};


export const fetchCDEForm = async (order_id: string) => {
  const response = await api.get<APIResponse<IWorkOrderDetail>>(ApiPath.fetchCDEForm+'/'+order_id)
  return response
};

export const DownloadCDEForm = async (order_id: string) => {

    const url = ApiPath.fetchCDEForm+'/'+order_id
    const filePath = `${RNFS.DocumentDirectoryPath}/${order_id}.pdf`;
    try {
      if (Platform.OS === 'ios') {
        actualDownload(url,order_id);
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            actualDownload(url,order_id);
          } else {
            console.log("please grant permission");
          }
        } catch (err) {
          console.log("display error",err)    }
      }
        
    } catch (error) {
      console.error('File download failed:', error);
    }
  
};

const actualDownload = (url:string,order_id:string) => {
  const { dirs } = RNFetchBlob.fs;
  const dirToSave =
    Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
  const configfb = {
    fileCache: true,
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: `CDEForm_${order_id}.pdf`,
      path: `${dirs.DownloadDir}/CDEForm_${order_id}.pdf`,
    },
    useDownloadManager: true,
    notification: true,
    mediaScannable: true,
    title: 'CDEForm_${order_id}.pdf',
    path: `${dirToSave}/CDEForm_${order_id}.pdf`,
  };
  const configOptions = Platform.select({
    ios: configfb,
    android: configfb,
  });

  RNFetchBlob.config(configOptions || {})
    .fetch('GET', url, {})
    .then(res => {

      if (Platform.OS === 'ios') {
        RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
        RNFetchBlob.ios.previewDocument(configfb.path);
      }
      if (Platform.OS === 'android') {
        console.log("file downloaded")      
}
    })
    .catch(e => {
      console.log('invoice Download==>', e);
          });
};

export const cancelWorkOrder = async (order_id: string) => {
  // console.log('[orderId]', order_id)
  const response = await api.post<APIResponse<any>>(ApiPath.cancelWorkOrder+'/'+order_id)
  return response.data
};
