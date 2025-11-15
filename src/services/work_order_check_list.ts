import ApiPath from '../constants/ApiPath';
import LocalStorageKey from '../constants/LocalStorageKey';
import {APIResponse} from '../models/apiResponse';
import {LoginResponseInterface} from '../models/login';
import {_getData} from '../utils/AsyncStorage';
import api from './api';

export const getCheckListCodeDefectMaster = async () => {
  const response = await api.get<APIResponse<any>>(ApiPath.getCheckListMaster);
  let data = response.data.dataResult;
  let dataConvert: any = {};
  data.map((val: any) => {
    let dataConvertKey: any = [];
    val.items.map((item: any) => {
      dataConvertKey.push({
        label: item['description'],
        value: item['code'],
        type: val['type'],
      });
    });
    
    Object.assign(dataConvert, {[`${val['type']}`]: dataConvertKey});
  });
  // console.info('dataConvert',dataConvert);
  return dataConvert;
};

export const getCheckListService = async (orderId: string) => {
  const result = await _getData({key: LocalStorageKey.userInfo});
  const userInformation = JSON.parse(result);
  const user = new LoginResponseInterface(userInformation);
  const response = await api.get<APIResponse<any>>(ApiPath.getCheckList, {
    params: {order_id: orderId, user_type: user.role},
  });
  let groupData: any = {};
  response.data.dataResult.checkList.map((val: any) => {
    Object.assign(groupData, {[val.type]: val});
  });
  Object.assign(groupData, {type: response.data.dataResult.type});
  return groupData;
};

export const getPmChecklistService = async (orderId: string) => {
  const result = await _getData({key: LocalStorageKey.userInfo});
  const userInformation = JSON.parse(result);
  const user = new LoginResponseInterface(userInformation);
  const response = await api.get<APIResponse<any>>(ApiPath.getPmChecklist, {
    params: {order_id: orderId, user_type: user.role},
  });
  return response.data.dataResult;
};

export const getPmChecklistVisiterInspectService = async (
  orderId: string,
  work_type: string,
) => {
  const result = await _getData({key: LocalStorageKey.userInfo});
  const userInformation = JSON.parse(result);
  const user = new LoginResponseInterface(userInformation);
  const response = await api.get<APIResponse<any>>(
    ApiPath.getPMChecklist_VisitInspector,
    {
      params: {order_id: orderId, user_type: user.role, work_type: work_type},
    },
  );
  return response.data.dataResult;
};

export const postCheckingListService = async (payload: any) => {
  const response = await api.post<APIResponse<any>>(ApiPath.postCheckingList, {
    ...payload,
  });
  return response.data;
};

export const postCheckingListVisiterInspectService = async (payload: any) => {
  const response = await api.post<APIResponse<any>>(
    ApiPath.CreateCheckinglist_VisitInspector,
    {
      ...payload,
    },
  );
  return response.data;
};

export const postCreateCheckinglist_Inspector = async (payload: any) => {
  const response = await api.post<APIResponse<any>>(
    ApiPath.CreateCheckinglist_Inspector,
    {
      ...payload,
    },
  );
  return response.data;
};

export const postImageCheckingListService = async (payload: any) => {
  const response = await api.post<APIResponse<any>>(
    ApiPath.setCheckingListImage,
    {
      ...payload,
    },
  );
  return response.data;
};

export const getImageCheckingListService = async (
  orderId: string,
  work_type: string,
) => {
  const response = await api.get<APIResponse<any>>(ApiPath.checkingListImage, {
    params: {order_id: orderId, work_type: work_type},
  });
  let dataResult = response.data.dataResult;
  let result = dataResult.images.reduce(function (r: any, a: any) {
    r[a.key] = r[a.key] || [];
    a = {
      fileName: '',
      fileSize: 0,
      height: 0,
      type: '',
      uri: a?.url,
      width: 0,
      key: `${a.key}`,
      formatType: 'url',
    };
    r[a.key].push(a);
    return r;
  }, Object.create(null));
  dataResult.images = result;
  return dataResult;
};

export const postPmCheckingListService = async (payload: any) => {
  const response = await api.post<APIResponse<any>>(
    ApiPath.postPmCheckingList,
    {...payload},
  );
  return response.data;
};

export const postPmCheckingListVisitInspectorService = async (payload: any) => {
  const response = await api.post<APIResponse<any>>(
    ApiPath.postPmCheckingListVisitInspector,
    {...payload},
  );
  return response.data;
};

export const getCheckListServiceVisitInspector = async (
  orderId: string,
  work_type: string,
) => {
  const result = await _getData({key: LocalStorageKey.userInfo});
  const userInformation = JSON.parse(result);
  const user = new LoginResponseInterface(userInformation);
  const response = await api.get<APIResponse<any>>(
    ApiPath.getChecklist_Inspector,
    {
      params: {order_id: orderId, work_type: work_type, user_type: user.role},
    },
  );

  let groupData: any = {};
  response.data.dataResult.checkList.map((val: any) => {
    Object.assign(groupData, {[val.type]: val});
  });
  Object.assign(groupData, {type: response.data.dataResult.type});
  return groupData;
};

export const getOperationVisitInspectorMaster = async () => {
  const response = await api.get<APIResponse<any>>(
    ApiPath.getOperationVisitInspectorMaster,
  );
  return response.data.dataResult;
};

export const getCheckListVisitInspectorService = async (
  orderId: string,
  work_type: string,
) => {
  const result: any = await _getData({key: LocalStorageKey.userInfo});
  const userInformation = JSON.parse(result);
  const user = new LoginResponseInterface(userInformation);
  const response = await api.get<APIResponse<any>>(
    ApiPath.getCheckListVisitInspector,
    {
      params: {order_id: orderId, work_type: work_type, user_type: user.role},
    },
  );
  return response.data.dataResult;
};

export const postCheckListVisitInspectorService = async (payload: any) => {
  const response = await api.post<APIResponse<any>>(
    ApiPath.CreateCheckinglist_VisitInspector,
    {
      ...payload,
    },
  );
  return response.data;
};

export const postImageCheckListService = async (payload: any) => {
  const response = await api.post<APIResponse<any>>(
    ApiPath.SetImageCheckListInspecter,
    {
      ...payload,
    },
  );
  return response.data;
};

export const getImageCheckListService = async (
  orderId: string,
  work_type: string,
) => {
  const response = await api.get<APIResponse<any>>(
    ApiPath.getImageCheckListInspector,
    {
      params: {order_id: orderId, work_type: work_type},
    },
  );
  return response.data.dataResult;
};
