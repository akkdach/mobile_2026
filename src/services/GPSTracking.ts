import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import {IGpsTracking} from '../models/gps-tracking';
import api from './api';

export const updateGpsTracking = async (payload: IGpsTracking) => {
  return await api.post<APIResponse<any>>(ApiPath.gpsTracking, payload);
};
