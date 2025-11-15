import ApiPath from "../constants/ApiPath";
import { APIResponse } from "../models/apiResponse";
import { IWorkOrderCheckInProcedure } from "../models/WorkOrderCheckInProcedure";
import api from "./api";

export const fetchWorkOrderCheckInProcedure = async (workOrder: string, workType?: string) => {
    const response = await api.get<APIResponse<IWorkOrderCheckInProcedure>>(ApiPath.workOrderProceduresGet, { params: {workOrder: workOrder, workType} });
    return response.data;
}

export const fetchWorkOrderCheckInProcedurePost = async (body: IWorkOrderCheckInProcedure) => {
    const response = await api.post<APIResponse<IWorkOrderCheckInProcedure>>(ApiPath.workOrderProceduresSet, body);
    return response.data
}