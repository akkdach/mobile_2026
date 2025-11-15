import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import api from './api';

export const getKnowledgeService = async () => {
    const response = await api.get<APIResponse>(ApiPath.knowledge);
    return response.data;
};
  
