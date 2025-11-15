import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import {WorkOrderConnectinvity} from '../models/WorkOrderConnectivity';
import api from './api';

export const fetchConnectivity = async (workOrder: string) => {
  return await api.get<APIResponse<WorkOrderConnectinvity>>(
    ApiPath.connectivity,
    { params: { workOrder } },
  );
};

export const updateConnectivity = async (payload: WorkOrderConnectinvity) => {
  return await api.post<APIResponse<WorkOrderConnectinvity>>(
    ApiPath.setConnectivity,
    payload,
  );
};
