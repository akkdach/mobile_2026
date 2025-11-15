import ApiPath from "../constants/ApiPath";
import { APIResponse } from "../models/apiResponse";
import api from "./api";

export const fetchUnderVansup = async (wk_ctr: string) => {
    const response = await api.get<APIResponse<any>>(ApiPath.getUnderVansup);
    return response.data.dataResult;
};
