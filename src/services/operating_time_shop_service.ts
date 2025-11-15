import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import api from './api';

export const getMasterActivityTypeMas = async () => {
  const response = await api.get<APIResponse>(
    ApiPath.workOrderMasterActivityTypeMas,
  );
  return response.data.dataResult;
};

export const getMasterWorkOrderWorker = async (order_id: any) => {
  const response = await api.get<APIResponse>(
    ApiPath.workOrderMasterWorkOrderWorker,
    {
      params: {order_id},
    },
  );
  return response.data.dataResult;
};

export const getTimeOperationWorker = async (orderId: any) => {
  const response = await api.get<APIResponse>(
    ApiPath.workOrderGetTimeOperationWorker,
    {
      params: {workOrder: orderId},
    },
  );
  return response.data.dataResult;
};

export const postTimeOperationWorker = async (data: any, isSubmit?: any) => {
  const response = await api.post<APIResponse>(
    ApiPath.workOrderSetTimeOperationWorker,
    {
      ...data,
      isSubmit
    },
  );
  return response.data;
};
