import ApiPath from "../constants/ApiPath";
import LocalStorageKey from "../constants/LocalStorageKey";
import { APIResponse } from "../models/apiResponse";
import { LoginResponseInterface } from "../models/login";
import { IWorkOrderSparePart, IWorkOrderSparePartStorage } from "../models/WorkOrderSparePart";
import { _getData } from "../utils/AsyncStorage";
import api from "./api";

export const fetchWorkOrderSparepart = async (order_id: string) => {
    const response = await api.get<APIResponse<IWorkOrderSparePart[]>>(ApiPath.workOrderSparepartGet, { params: {workOrder: order_id} });
    return response.data;
};

export const fetchWorkOrderSparepartStorage = async (order_id: string) => {
    const result = await _getData({key: LocalStorageKey.userInfo});
    const userInformation = JSON.parse(String(result));
    const user = new LoginResponseInterface(userInformation);
    const response = await api.get<APIResponse<IWorkOrderSparePartStorage[]>>(ApiPath.workOrderSparepartStorage, { params: { workOrder: order_id, vanNo: user.wk_ctr } });
    return response.data;
}

export const fetchWorkOrderSparepartPost = async (body: IWorkOrderSparePart[], orderId?: string) => {
    const response = await api.post<APIResponse<IWorkOrderSparePart[]>>(`${ApiPath.workOrderSparepartSet}?OrderId=${orderId}`, body);
    return response.data
}