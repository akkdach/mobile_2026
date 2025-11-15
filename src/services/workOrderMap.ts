import ApiPath from "../constants/ApiPath";
import { APIResponse } from "../models/apiResponse";
import { IWorkOrderMap } from "../models/WorkOrderMap";
import api from "./api";

export const fetchtWorkOrderMap = async (order_id: string) => {
    const response = await api.get<APIResponse<IWorkOrderMap>>(ApiPath.workOrderMap, { params: {order_id} });
    return response.data.dataResult;
};