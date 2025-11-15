import ApiPath from "../constants/ApiPath";
import { APIResponse } from "../models/apiResponse";
import { IWorkOrderMap } from "../models/WorkOrderMap";
import api from "./api";

export const fetchtGetUnderVanSub = async () => {
    const response = await api.get<APIResponse<IVanSup>>(ApiPath.workOrderListUnderSup);
    return response.data;
};

export const fetchtGetWorkOrderVanSub = async () => {
    const response = await api.get<APIResponse<any>>(ApiPath.workOrderListApprove);
    return response.data;
};

export const fetchPostActionApprove = async (payload: IActionApprove) => {
    const response = await api.post<APIResponse>(
        ApiPath.actionApprove,
        payload,
    );
    return response.data;
}

interface IVanSup { 
    wk_ctr: string, 
    plant: string 
}

interface IActionApprove { 
    workOrderId: string, 
    approveAction: string 
    referToWorkCenter: string
}