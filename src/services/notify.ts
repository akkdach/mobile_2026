import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import api from './api';

export const getNotifyService = async () => {
  const response = await api.get<APIResponse>(ApiPath.notify);
  return response.data;
};

export const getNotificationService = async () => {
  const response = await api.get<APIResponse>(ApiPath.notification);
  return response.data;
};

export const updatedNotificationService = async (body: object) => {
  const response = await api.patch<APIResponse>(ApiPath.notificationRead, body);
  return response.data;
};
