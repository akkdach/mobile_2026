import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import api from './api';

export const getNotiCount = async () => {
  const response = await api.get<APIResponse>(ApiPath.GetNotiCount);
  return response.data;
};
