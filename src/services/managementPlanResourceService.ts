import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import api from './api';

export const getVanManagementService = async (date?: any, wk_ctr?: any) => {
  const response = await api.post<APIResponse<any>>(
    `${ApiPath.getVanManagement}`,{
      "vanSup": wk_ctr,
      "startDate": date
    }
  );
  return response.data.dataResult;
};

export const getVanTypeManagementService = async () => {
  const response = await api.get<APIResponse<any>>(
    ApiPath.getVanTypeManagement,
  );
  return response.data.dataResult;
};

export const getReasonService = async () => {
  const response = await api.get<APIResponse<any>>(ApiPath.getReason);
  return response.data.dataResult;
};

export const postVanManagementService = async (payload: any, date: any) => {
  // const data = {date: date, data: payload};
  const response = await api.post<APIResponse<any>>(
    ApiPath.postVanManagementService,
    payload,
  );
  return response.data;
};
