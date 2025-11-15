import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import api from './api';

export const getWorkCenter = async (): Promise<any> => {
  const response = await api.get<APIResponse<any>>(ApiPath.workCenter);
  let mapDate: any = [];
  response.data.dataResult.map((val: any) => {
    mapDate.push({label: val, value: val});
  });
  return mapDate;
};
