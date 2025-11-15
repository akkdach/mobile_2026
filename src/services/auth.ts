import api from './api';
import {LoginInterface, LoginResponseInterface} from '../models/login';
import {_getData, _removeData, _storeData} from '../utils/AsyncStorage';
import LocalStorageKey from '../constants/LocalStorageKey';

import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';

export const TOKEN_KEY = LocalStorageKey.token;

export const signIn = async (data: LoginInterface) => {
  const response = await api.post<APIResponse<LoginResponseInterface>>(
    ApiPath.signIn,
    {
      username: data.username,
      password: data.password,
    },
  );
  // console.log('======== response ===========',response)
  const result = response?.data?.dataResult as LoginResponseInterface;

  // console.log('result ====>', result)

  await _storeData({key: TOKEN_KEY, value: result.access_token});
  await _storeData({
    key: LocalStorageKey.userInfo,
    value: {
      role: result.role,
      wk_ctr: result.wk_ctr,
      fullName: result.fullName,
      urlProfile: result.urlProfile,
      employeeId: result.employeeId,
    },
  });
};

export const signOut = () => _removeData({key: TOKEN_KEY});

export const getToken = async () => {
  return await _getData({key: TOKEN_KEY});
};

export const isSignedIn = async () => {
  return await _getData({key: TOKEN_KEY});
};

export const updateTokenNotify = async (payload: {Token: string}) => {
  return await api.put<APIResponse<any>>(
    `${ApiPath.updateTokenNotify}?Token=${payload.Token}`,
  );
};
