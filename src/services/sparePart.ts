import ApiPath from '../constants/ApiPath';
import {
  ISparePartRemaining,
  ISparePartTO,
  ISparePartTransferStore,
} from '../models';
import {APIResponse} from '../models/apiResponse';
import {IWorkOrderSparepartDetail} from '../models/WorkOrderDetail';
import {ISparePartRequest, ISparePartRequestHD, ISparePartRequestItem} from '../models/WorkOrderSparePart';
import api from './api';

export const fetchSparePart = async (): Promise<
  IWorkOrderSparepartDetail[]
> => {
  return Promise.resolve([]);
  // return await api.get()
};

export const postSparePartTransferStore = async (
  statusToNav: string,
  tranNo: string,
  material_type: string = ''
): Promise<APIResponse<ISparePartTransferStore>> => {
  const response = await api.post<APIResponse<ISparePartTransferStore>>(
    ApiPath.sparePartReceiveFromNAV,
    {statusToNav, tranNo, material_type},
  );
  return response.data;
};

export const fetchSparePartRemaining = async (): Promise<
  APIResponse<ISparePartRemaining>
> => {
  const response = await api.get<APIResponse<ISparePartRemaining>>(
    ApiPath.sparePartRemaining,
  );
  return response.data;
};


export const SynSpareBalance = async (): Promise<
  APIResponse<any>
> => {
  const response = await api.get<APIResponse<any>>(
    ApiPath.sparePartSyn,
  );
  return response.data;
};



export const fetchRemainingTools = async (): Promise<
  APIResponse<ISparePartRemaining>
> => {
  const response = await api.get<APIResponse<ISparePartRemaining>>(
    ApiPath.toolsRemaining,
  );
  return response.data;
};

export const fetchSparePartTransferRequest = async (material_type: string = ''): Promise<
  APIResponse<string[]>
> => {
  const response = await api.get<APIResponse<string[]>>(
    `${ApiPath.sparePartTransferRequest}?material_type=${material_type}`,
  );
  return response.data;
};

export const fetchSparePartAddTransferRequest = async (
  stge_loc: string,
  material_type: string = ''
): Promise<APIResponse<ISparePartRequest[]>> => {
  const response = await api.get<APIResponse<ISparePartRequest[]>>(
    `${ApiPath.sparePartAddTransferRequest}?stge_loc=${stge_loc}&material_type=${material_type}`,
  );
  return response.data;
};


export const fetchGetMaterialMaster = async (
): Promise<APIResponse<any[]>> => {
  const response = await api.get<APIResponse<any[]>>(
    `${ApiPath.GetMaterialMaster}`,
  );
  return response.data;
};

export const fetchSaveRecommentPart = async (data:any
): Promise<APIResponse<any[]>> => {
  const response = await api.post<APIResponse<any[]>>(
    `${ApiPath.SaveRecommentPart}`,data
  );
  return response.data;
};

export const fetchGetRecommentPart = async (orderid:string
): Promise<APIResponse<any[]>> => {
  const response = await api.post<APIResponse<any[]>>(
    `${ApiPath.GetRecommentPart}/${orderid}`
  );
  return response.data;
};

export const fetchSparePartReceiveTONumber = async (
  stge_loc: string,
  material_type: string = ''
): Promise<APIResponse<any[]>> => {
  const response = await api.get<APIResponse<any[]>>(
    `${ApiPath.sparePartReceiveToNumber}?stge_loc=${stge_loc}&material_type=${material_type}`,
  );
  return response.data;
};

export const postSparePartReservationRequest = async (
  payload: any
): Promise<APIResponse<any>> => {
  const response = await api.post<APIResponse<any>>(
    `${ApiPath.sparePartReservationRequest}`,
    payload,
  );
  return response.data;
};

export const postSparePartRequest = async (
  stge_loc: string,
  material_type: string = ''
): Promise<APIResponse<any[]>> => {
  const response = await api.get<APIResponse<any[]>>(
    `${ApiPath.sparePartTransferToNumber}?stge_loc=${stge_loc}&material_type=${material_type}`,
  );
  return response.data;
};

export const fetchProcessTransferPostShip = async (
  stge_loc: string,
  to_number: string,
  remark?: string,
  material_type: string = ''
): Promise<APIResponse<any>> => {
  const response = await api.get<APIResponse<any>>(
    `${ApiPath.processTransferPostShip}?stge_loc=${stge_loc}&to_number=${to_number}&remark=${remark}&material_type=${material_type}`,
  );
  return response.data;
};

export const fetchSparePartListTONumber = async (
  stge_loc: string,
  to_number: string[],
  remark?: string,
  material_type: string = ''
): Promise<APIResponse<ISparePartTO>> => {
  const toNumbers = to_number.join('&to_numbers=');
  const response = await api.get<APIResponse<ISparePartTO>>(
    `${ApiPath.receiveTranferSpareFromVan}?stge_loc=${stge_loc}&to_numbers=${toNumbers}&remark=${remark}&material_type=${material_type}`,
  );
  return response.data;
};

export const fetchTransferRequestTo = async (material_type: string = ''): Promise<
  APIResponse<string[]>
> => {
  const response = await api.get<APIResponse<string[]>>(
    `${ApiPath.sparePartTransferRequestTo}?material_type=${material_type}`,
  );
  return response.data;
};

export const fetchSparePartRequestHd = async (action:string=""): Promise<
  APIResponse<ISparePartRequestHD[]>
> => {
  const response = await api.post<APIResponse<ISparePartRequestHD[]>>(
    action ? `${ ApiPath.ReservationRequest_Waite}/${action}` :ApiPath.ReservationRequest_Waite,
  );
  return response.data;
};
export const fetchSparePartRequestHdVan = async (action:string=""): Promise<
  APIResponse<ISparePartRequestHD[]>
> => {
  const response = await api.post<APIResponse<ISparePartRequestHD[]>>(
    `${ApiPath.ReservationRequest_Waite_Van}`,
  );
  return response.data;
};

export const fetchSparePartRequestItem = async (resId:number): Promise<
  APIResponse<ISparePartRequestItem[]>
> => {
  const response = await api.post<APIResponse<ISparePartRequestItem[]>>(
    `${ApiPath.ReservationRequest_Item+'/'+resId}`,
  );
  return response.data;
};

export const fetchSparePartRequestCancel = async (resId:string): Promise<
  APIResponse<ISparePartRequestItem[]>
> => {
  const response = await api.post<APIResponse<ISparePartRequestItem[]>>(
    `${ApiPath.ReservationRequest_Cancel+'/'+resId}`,
  );
  return response.data;
};

export const fetchSparePartRequestApprove = async (resId:string): Promise<
  APIResponse<any>
> => {
  const response = await api.post<APIResponse<string>>(
    `${ApiPath.ReservationRequest_approve+'/'+resId}`,
  );
  return response.data;
};