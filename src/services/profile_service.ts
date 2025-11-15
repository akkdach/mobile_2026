import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import api from './api';

export const getProfileService = async () => {
  const response = await api.get<APIResponse>(ApiPath.getProfile);
  return response.data;
};
export const ChangePasswordService = async (data:any) => {
  const response = await api.put<APIResponse>(ApiPath.ChangePassword,data);
  return response.data;
};
