import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import api from './api';

export const getImageOtherService = async (orderId?:any, type?: any, objType?: any) => {
  const response = await api.get<APIResponse>(ApiPath.getImageOther, {
    params: {orderId: orderId, orderType: type, objType: objType},
  });
  return response.data;
};

export const postImageOtherService = async (
  payload: any,
): Promise<APIResponse<any>> => {
  console.log("[payload]", JSON.stringify(payload, null, 2))
  const response = await api.post<APIResponse<any>>(
    `${ApiPath.imageOther}`,
    payload,
  );
  return response.data;
};


export const removeImagesOther = async (url: any) => {
  const response = await api.delete<APIResponse<any>>(
    `${ApiPath.removeImageOther}?url=${url}`,
  );
  return response.data;
};