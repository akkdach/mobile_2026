export interface TimeOperationWorker {
  standardTime: number;
  startDate: string;
  endDate?: any;
  details: Detail[];
  travelCharge: boolean;
}

interface Detail {
  operationId: number;
  description: string;
  acttype: string;
  activity: string;
  presonnel: Presonnel[];
  startTime?:string;
  totalTime:string;
  startDate:string;
}

interface Presonnel {
  personnalNumber: string;
  personnalName: string;
}