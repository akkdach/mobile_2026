import ApiPath from "../constants/ApiPath";
import { APIResponse } from "../models/apiResponse";
import { WorkListApproveOTInterface } from "../models/work_list_approve_ot";
import api from "./api";


export const fetchtWorkListApproveOTUnderSupForMobile = async (wk_ctr: string) => {
    const response = await api.get<APIResponse<IVanSup>>(`${ApiPath.workListApproveOTUnderSupForMobile}/${wk_ctr}`);
    return response.data;
};

export const fetchWorkListAppoveOTGet = async (wk_ctr: string) => {
    const response = await api.get<APIResponse<WorkListApproveOTInterface>>(`${ApiPath.workListApproveOT}/${wk_ctr}`);
    return response.data;
}

export const fetchWorkListAppoveOTPost = async (body: { orderId: string, approveAction: string, referToWorkCenter: string }) => {
    const response = await api.post<APIResponse<any>>(ApiPath.workListApproveOT, body);
    return response.data
}


interface IVanSup { 
    wk_ctr: string, 
    plant: string 
}
