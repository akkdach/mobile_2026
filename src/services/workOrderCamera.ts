import ApiPath from "../constants/ApiPath"
import { APIResponse } from "../models/apiResponse"
import { IWorkOrderCamera } from "../models/WorkOrderCamera"
import api from "./api"

export const fetchWorkOrderImageGet = async (order_id: string) => {
    const response = await api.get<APIResponse<IWorkOrderCamera>>(ApiPath.workOrderImageGet, { params: { order_id } });
    return response.data
}
export const fetchGetMasterWorkorderImageGet = async (order_id: string) => {
    const response = await api.get<APIResponse<IWorkOrderCamera>>(ApiPath.GetMasterWorkorderImage, { params: { order_id } });
    return response.data
}

export const fetchWorkOrderImageUpdate = async (payload: IWorkOrderCamera) => {
    const response = await api.put<APIResponse<any>>(ApiPath.workOrderImageUpdate, payload);
    return response.data;
}


