import ApiPath from "../constants/ApiPath";
import { APIResponse } from "../models/apiResponse";
import { IWorkOrderCloseWork } from "../models/WorkOrderCloseWork";
import api from "./api";

export const fetctInformationCloseWork = async (order_id: string, work_type?: string) => {
    // { params: {order_id, work_type} }
    let temp = `?order_id=${order_id}`;
    if(work_type) {
        temp += `&work_type=${work_type}`;
    };
    const response = await api.get<APIResponse<IWorkOrderCloseWork>>(`${ApiPath.informationCloseWork}${temp}`);
    return response.data;
}