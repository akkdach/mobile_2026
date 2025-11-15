import ApiPath from '../constants/ApiPath';
import { APIResponse } from '../models/apiResponse';
import { ICatalog, IWorkOrderProblem } from '../models/WorkOrderProblem';
import api from './api';

export const fetchCatalogGroup = async (order_id: string) => {
  return await api.get<APIResponse<ICatalog[]>>(ApiPath.catalogCodeGroup, {
    params: {order_id},
  });
};

export const fetchCatalogGroup2 = async (order_id: string,damage:string) => {
  return await api.get<APIResponse<ICatalog[]>>(ApiPath.catalogCodeGroup2, {
    params: {order_id,damage},
  });
};

export const fetchAllProblem = async (order_id: string) => {
  return await api.get<APIResponse<any>>(ApiPath.checkAllProblem, {
    params: {order_id},
  });
};

export const createAllProblem = async (payload: IWorkOrderProblem) => {
  return await api.post<APIResponse<any>>(ApiPath.createProblem, payload);
};

// export const updateConnectivity = async (payload: WorkOrderConnectinvity) => {
//   return await api.post<APIResponse<any>>(
//     ApiPath.setConnectivity,
//     payload,
//   );
// };
