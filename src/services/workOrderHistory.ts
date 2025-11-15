import ApiPath from "../constants/ApiPath";
import { APIResponse } from "../models/apiResponse";
import { IWorkOrderHistory } from "../models/WorkOrderHistory";
import api from "./api";

export const fetchtWorkOrderHistory = async (order_id: string) => {
    const response = await api.get<APIResponse<IWorkOrderHistory[]>>(ApiPath.workOrderHistory, { params: {order_id} });
    return response.data.dataResult;
};