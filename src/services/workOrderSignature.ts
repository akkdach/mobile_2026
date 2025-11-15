import ApiPath from "../constants/ApiPath";
import { APIResponse } from "../models/apiResponse";
import { IWorkOrderCloseWork } from "../models/WorkOrderCloseWork";
import api from "./api";

export const fetchWorkOrderCloseWork = async (workOrder: string) => {
    const response = await api.get<APIResponse<IWorkOrderCloseWork>>(ApiPath.workOrderCloseWorkGet, { params: {workOrder: workOrder} });
    return response.data;
}

export const fetchWorkOrderCloseWorkPost = async (payload: IWorkOrderCloseWork) => {
    console.log(ApiPath.workOrderCloseWorkSet+' '+payload);
    const response = await api.post<APIResponse<IWorkOrderCloseWork>>(ApiPath.workOrderCloseWorkSet, payload);
    return response.data;
}