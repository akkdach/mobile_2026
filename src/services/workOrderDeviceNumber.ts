import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import {IWorkOrderDeviceNumber} from '../models/WorkOrderDeviceNumber';
import api from './api';

export const fetchtWorkOrderDeviceNumber = async (
  cdeCode?: string,
): Promise<APIResponse<IWorkOrderDeviceNumber[]>> => {
  const response = await api.get<APIResponse<IWorkOrderDeviceNumber[]>>(
    ApiPath.workOrderDeviceNumber,
    {params: {cdeCode}},
  );
  return response.data;
};

export const fetchWorkOrderDeviceNumberDetail = async (
  orderId: string,
): Promise<APIResponse<any>> => {
  const response = await api.get<APIResponse<any>>(
    ApiPath.workOrderDeviceNumberDetail,
    {params: {order_id: orderId}},
  );
  return response.data;
};

export const fetchUpdateWorkOrderDeviceNumber = async (
  cdeCode: string,
  workOrderId: string,
): Promise<APIResponse<any>> => {
  const response = await api.post<APIResponse<any>>(
    ApiPath.workOrderDeviceNumber,
    {cdeCode, workOrderId},
  );
  return response.data;
};
