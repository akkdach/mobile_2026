import ApiPath from "../constants/ApiPath"
import { APIResponse } from "../models/apiResponse"
import { IWorkOrderCamera } from "../models/WorkOrderCamera"
import { IWorkOrderImage, IWorkOrderImageSTD } from "../models/WorkOrderImage"
import api from "./api"

export const fetWorkorderStandardImage = async (order_id: string) => {
    const response = await api.get<APIResponse<IWorkOrderImageSTD[]>>(ApiPath.workorderStandardImageUrl+'/'+order_id);
    return response.data
}

export const fetWorkorderStandardImageGet = async (orderId: string) => {
    const response = await api.get<APIResponse<Array<IWorkOrderImage>>>(ApiPath.workOrderImageGet_new+'/'+orderId );
    return response.data
}


