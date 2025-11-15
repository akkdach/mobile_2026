import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import {IWorkOrderCustomer} from '../models/WorkOrderCustomer';
import { ISalePriceDetail } from '../models/WorkOrderDetail';
import {customLog} from '../utils/CustomConsole';
import api from './api';

export const fetchtWorkOrderCustomer = async (order_id: string) => {
  const response = await api.get<APIResponse<IWorkOrderCustomer>>(
    ApiPath.workOrderCustomer,
    {params: {order_id}},
  );
  return response.data.dataResult;
};

export const fetchSalePrice = async (
  order_id: string,
  bill_no: string,
): Promise<APIResponse<ISalePriceDetail>> => {
  const response = await api.get<APIResponse<ISalePriceDetail>>(ApiPath.simulate, {
    params: {order_id, bill_no},
  });
  return response.data;
};

export const fetchBillNumber = async (
  wk_ctr: string,
  workOrder: string
): Promise<APIResponse<any>> => {
  const response = await api.get<APIResponse<any>>(ApiPath.billNo, {
    params: {wk_ctr, workOrder},
  });
  return response.data;
};
