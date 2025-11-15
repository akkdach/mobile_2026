import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import {CockInCockOut} from '../models/cockin_cockout';
import api from './api';

export const checkCockInCockOut = async () => {
  const response = await api.get<APIResponse<any>>(ApiPath.checkCockIn);
  return response.data.dataResult as CockInCockOut;
};

export const checkCockInCockOutStamp = async () => {
  const response = await api.get<APIResponse<any>>(ApiPath.checkCockInStamp);
};
