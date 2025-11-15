export interface TimeOperationWorkerInterface {
  operationId: number;
  description: string;
  acttype: string;
  activity: string;
  startTime: string;
  endTime: string;
  totalTime: string;
  presonnel: Presonnel[];
}

interface Presonnel {
  label: string;
  value: string;
  checked: boolean;
}
