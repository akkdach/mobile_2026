import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import api from './api';

export const getClaimList = async () => {
  const response = await api.get<APIResponse>(ApiPath.ClaimList);
  return response.data;
};
