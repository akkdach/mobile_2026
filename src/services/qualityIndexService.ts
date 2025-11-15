import ApiPath from '../constants/ApiPath';
import {APIResponse} from '../models/apiResponse';
import api from './api';
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

export const postQualityIndex = async (orderId: String,type:string ='CSD',qiResult:string, data: any,reason:string) => {
  let dataObject = {};
  data.map((val: any) => {
    dataObject = {...dataObject, ...val, ...{workOrder: orderId,reason:reason,type:type,qiResult:qiResult}};
  });
  
  const response = await api.post<APIResponse<any>>(
    ApiPath.qualityIndex,
    dataObject,
    {params: {workOrder: orderId}},
  );
  return response.data;
};

export const getQualityIndex = async (orderId: String,type : string) => {
  const response = await api.get<APIResponse<any>>(ApiPath.getQualityIndex, {
    params: {workOrder: orderId,type: type},
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
  return {defectItem, cloneValue,data: response.data};
};

export const getQualityIndexMaster = async (type:string) => {
  const response = await api.get<APIResponse<any>>(
    `${ApiPath.qualityIndexMasterDefect}/${type}`,
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

export const fetchCloseQIInformation = async (orderId: string) => {
  const response = await api.post<APIResponse<any>>(
    ApiPath.closeQIInformation,
    {orderId},
  );
  return response.data.dataResult;
};

export const fetchCloseQIInformation2 = async (orderId: string) => {
  const response = await api.post<APIResponse<any>>(
    ApiPath.closeQIInformation2,
    {orderId},
  );
  return response.data.dataResult;
};
