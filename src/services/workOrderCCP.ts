import ApiPath from '../constants/ApiPath';
import { APIResponse } from '../models/apiResponse';
import api from './api';

export const fetchCCPCheck = async (equipmentNo: string) => {
  const response = await api.get<APIResponse<any>>(ApiPath.workOrderCCPCheck, { params: {equipmentNo} });
  return response.data;
};