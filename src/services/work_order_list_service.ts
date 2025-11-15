import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import { CheckInShop } from '../models/checkIn_shop';
import api from './api';

export const checkInShop = async (data: any) => {
  const response = await api.post<APIResponse>(
    ApiPath.workOrderCheckInShop,
    data,
  );
  return response.data;
};

export const getCheckInShop = async (data: any) => {
  const response = await api.get<APIResponse<CheckInShop>>(ApiPath.workOrderGetCheckInShop, {
    params: {...data},
  });
  return response.data;
};
