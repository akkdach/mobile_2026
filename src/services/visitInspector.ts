import ApiPath from "../constants/ApiPath";
import LocalStorageKey from "../constants/LocalStorageKey";
import { APIResponse } from "../models/apiResponse";
import { LoginResponseInterface } from "../models/login";
import { IWorkOrderVisitInspectorCloseWork } from "../models/WorkOrderCloseWork";
import { _getData } from "../utils/AsyncStorage";
import api from "./api";

const defectMaster = [
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
    {
      defectCode: '',
      defectDetail: '',
    },
  ];

export const fetchtVisitInspector = async () => {
    const response = await api.get<APIResponse<any>>(ApiPath.workOrderVisitInspector);
    return response.data.dataResult;
};

export const getTimeOperationWorkerInspector = async (orderId: any, workType: string) => {
    const response = await api.get<APIResponse>(
        ApiPath.workOrderGetTimeOperationWorkerInspector,
        {
            params: {workOrder: orderId, WorkType: workType},
        },
    );
    return response.data.dataResult;
};
  
export const postTimeOperationWorkerInspector = async (data: any, isSubmit?: any) => {
    const response = await api.post<APIResponse>(
        ApiPath.workOrderSetTimeOperationWorkerInspector,
        {
        ...data,
        isSubmit
        },
    );
    return response.data;
};

export const getQualityIndexMasterInspector = async () => {
    const response = await api.get<APIResponse<any>>(
      ApiPath.qualityIndexMasterDefect,
      {},
    );
    let group = response.data.dataResult.reduce((r: any, a: any) => {
      r[a.subGroup.replace(' ', '').replace('/', '')] = [
        ...(r[a.subGroup.replace(' ', '').replace('/', '')] || []),
        a,
      ];
      return r;
    }, {});
  
    let dataGroupObject = {};
    for (const key in group) {
      if (Object.prototype.hasOwnProperty.call(group, key)) {
        let dataConvert: any = [];
        group[key].map((val: any) => {
          dataConvert.push({label: val.description, value: val.code});
        });
        Object.assign(dataGroupObject, {[`${key}`]: dataConvert});
      }
    }
    return dataGroupObject;
};

export const getQualityIndexInspector = async (orderId: String) => {
  const response = await api.get<APIResponse<any>>(ApiPath.workOrderGetQualityIndexInspector, {
    params: {workOrder: orderId},
  });
  let defectDetails: any = [
    {defectDetail: defectMaster},
    {defectDetail: defectMaster},
    {defectDetail: defectMaster},
    {defectDetail: defectMaster},
    {defectDetail: defectMaster},
  ];
  let data = response.data.dataResult;
  let defectItem = [];
  const cloneValue = [...defectDetails];
  let index = 0;
  for (const key in data) {
    defectItem.push({[key]: data[key]});
    if (data[key]['defectDetail'].length > 0) {
      const newKey = `defectDetail`;
      const newObjArr = [...defectDetails[index][`defectDetail`]];
      for (let i = 0; i < data[key]['defectDetail'].length; i++) {
        let item = {
          defectCode: data[key]['defectDetail'][i]['defectCode'],
          defectDetail: data[key]['defectDetail'][i]['defectDetail'],
        };
        newObjArr.splice(i, 1, item);
        const newObjReplace = {
          [newKey]: newObjArr,
        };
        cloneValue.splice(index, 1, newObjReplace);
      }
    } else {
      cloneValue.splice(index, 1, {defectDetail: defectMaster});
    }
    index = index + 1;
  }
  return {defectItem, cloneValue};
};

export const postQualityIndexInspector = async (orderId: String, data: any) => {
  let dataObject = {};
  data.map((val: any) => {
    dataObject = {...dataObject, ...val, ...{workOrder: orderId}};
  });
  
  const response = await api.post<APIResponse<any>>(
    ApiPath.workOrderSetQualityIndexInspector,
    dataObject,
    {params: {workOrder: orderId}},
  );
  return response.data;
};

export const getCheckListInspector = async (orderId: string, work_type: string) => {
  const response = await api.get<APIResponse<any>>(ApiPath.workOrderGetCheckListInspector, {
    params: {order_id: orderId, work_type: work_type},
  });
  let groupData: any = {};
  response.data.dataResult.checkList.map((val: any) => {
    Object.assign(groupData, {[val.type]: val});
  });
  Object.assign(groupData, {type: response.data.dataResult.type});
  return groupData;
}

export const postCheckListInspector = async (payload: any) => {
  const response = await api.post<APIResponse<any>>(ApiPath.workOrderSetCheckListInspector, {
    ...payload,
  });
  return response.data;
}

export const fetchWorkOrderCloseWorkInspector = async (workOrder: string, work_type: string) => {
  const response = await api.get<APIResponse<IWorkOrderVisitInspectorCloseWork>>(ApiPath.workOrderGetCloseWorkInspector, { params: {workOrder: workOrder, work_type: work_type} });
  return response.data;
}

export const fetchWorkOrderCloseWorkPostInspector = async (payload: IWorkOrderVisitInspectorCloseWork) => {
  const response = await api.post<APIResponse<IWorkOrderVisitInspectorCloseWork>>(ApiPath.workOrderSetCloseWorkInspector, payload);
  return response.data;
}

export const fetchtCreateVisit = async (data: any[]) => {
  const response = await api.post<APIResponse<any>>(ApiPath.visitor, data);
  return response.data.dataResult;
};

export const fetchtDeleteVisit = async (data: any[]) => {
  const response = await api.delete<APIResponse<any>>(ApiPath.visitor, {data});
  return response.data.dataResult;
};


