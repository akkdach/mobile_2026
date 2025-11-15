import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import {SparePartOutstanding} from '../models/SparePartOutstanding';
import {IWorkOrderCheckOutCloseType} from '../models/workOrderCheckOutCloseType';
import { _getData, _getDataJson } from '../utils/AsyncStorage';
import api from './api';

export const fetchCheckOutWorkingTime = async (workOrder: string) => {
  const response = await api.get<APIResponse<any>>(
    ApiPath.workOrderCheckOutWorkingTime,
    {params: {workOrder}},
  );
  return response.data;
};

export const fetchCheckOutLackOfSparePartsList = async (workOrder: string,item:string ="") => {
  const response = await api.get<APIResponse<SparePartOutstanding[]>>(
    ApiPath.workOrderCheckOutLackOfSparePartsList,
    {params: {workOrder,item}},
  );
  return response.data;
};

export const fetchCheckOutLackOfSpareParts = async (payload: {
  workOrder: string;
  sparePartsItem: SparePartOutstanding[];
}) => {
  const response = await api.post<APIResponse<any>>(
    ApiPath.workOrderCheckOutLackOfSpareParts,
    payload,
  );
  return response.data;
};

export const fetchCheckOutChangeDeviceGet = async (workOrder: string) => {
  const response = await api.get<APIResponse<any>>(
    ApiPath.workOrderGetCheckOutChangeDevice,
    {params: {workOrder}},
  );
  return response.data;
};

export const fetchCheckOutChangeDeviceSet = async (payload: any) => {
  const response = await api.post<APIResponse<any>>(
    ApiPath.workOrderSetCheckOutChangeDevice,
    payload,
  );
  return response.data;
};

export const fetchCheckOutEquipmentMovementGet = async (workOrder: string) => {
  const response = await api.get<APIResponse<any>>(
    ApiPath.workOrderGetCheckOutEquipmentMovement,
    {params: {workOrder}},
  );
  return response.data;
}

export const fetchCheckOutEquipmentMovementSet = async (payload: any) => {
  const response = await api.post<APIResponse<any>>(
    ApiPath.workOrderSetCheckOutEquipmentMovement,
    payload,
  );
  return response.data;
};

export const fetchCauseCheckOutOptionCloseType = async (payload: {
  WorkOrder: string;
  CodeGroup: string;
}) => {
  const response = await api.get<APIResponse<any>>(
    ApiPath.workOrderCheckOutOptionCloseType,
    {params: payload},
  );
  return response.data;
};

export const fetchCheckOutCloseTypeGet = async (WorkOrder: string) => {
  const response = await api.get<APIResponse<any>>(
    ApiPath.workOrderGetCheckOutCloseType,
    {params: {WorkOrder}},
  );
  return response.data;
};

export const fetchCheckOutCloseTypeSet = async (
  payload: IWorkOrderCheckOutCloseType,
) => {
  const gpsDataTmp:any = await  _getDataJson({key: 'gpsTracking'});
  payload.lon = parseFloat(gpsDataTmp.long);
  payload.lat = parseFloat(gpsDataTmp.lat)
  // console.log('gpsdata temp',gpsDataTmp,payload)
  const response = await api.post<APIResponse<any>>(
    ApiPath.workOrderSetCheckOutCloseType,
    payload,
  );
  return response.data;
};

export const fetchCheckOutEquipmentNotMatchGet = async (WorkOrder: string) => {
  const response = await api.get<APIResponse<any>>(
    ApiPath.getCheckOutEquipmentNotMatch,
    {params: {WorkOrder}},
  );
  return response.data;
};

export const fetchCheckOutEquipmentNotMatchSet = async (payload: {
  workOrder: string;
  equipment: string;
  equipmentType: string;
  comment: string;
}) => {
  const response = await api.post<APIResponse<any>>(
    ApiPath.setCheckOutEquipmentNotMatch,
    payload,
  );
  return response.data;
};
