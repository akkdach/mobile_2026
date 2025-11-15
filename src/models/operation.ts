export interface IOperation {
  WORK_ORDER_OPERATION_ID: number;
  ORDERID: string;
  ACTIVITY: string;
  CONTROL_KEY: string;
  WORK_CNTR: string;
  WORK_CENTER?: any;
  PLANT: string;
  DESCRIPTION: string;
  NUMBER_OF_CAPACITIES: number;
  ACTTYPE: string;
  DURATION_NORMAL: number;
  DURATION_NORMAL_UNIT: string;
  WORK_ACTIVITY: number;
  UN_WORK: string;
  CONF_NO: string;
  WORK_ACTUAL: number;
  ACT_START_DATE?: any;
  ACT_START_TIME: string;
  ACT_END_DATE?: any;
  ACT_END_TIME: string;
  SYSTEM_STATUS_TEXT?: any;
  WORK_ACTUAL_START?: any;
  WORK_ACTUAL_FINISH?: any;
}
