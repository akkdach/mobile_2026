import ApiPath from '../constants/ApiPath';
import LocalStorageKey from '../constants/LocalStorageKey';
import {APIResponse} from '../models/apiResponse';
import {
  CheckWorkInWorkOut,
  CheckWorkInWorkOutInterface,
} from '../models/checkWorkInWorkOut';
import {LoginResponseInterface} from '../models/login';
import {_getData} from '../utils/AsyncStorage';
import api from './api';

export const checkWorkInWorkOut = async () => {
  const result = await _getData({key: LocalStorageKey.userInfo});
  const userInformation = JSON.parse(result);
  const user = new LoginResponseInterface(userInformation);
  const response = await api.get<APIResponse<any>>(ApiPath.workIn, {
    params: {wk_ctr: user.wk_ctr},
  });
  return response.data.dataResult as CheckWorkInWorkOut;
};

export const workInWorkOutStamp = async (data: CheckWorkInWorkOutInterface): Promise<any> => {
  const result = await _getData({key: LocalStorageKey.userInfo});
  const userInformation = JSON.parse(result);
  const user = new LoginResponseInterface(userInformation);
  data.workCenter = user.wk_ctr;
  const response = await api.post<APIResponse<any>>(ApiPath.stampdayInOut, {
    ...data,
  });
  return response.data
};
