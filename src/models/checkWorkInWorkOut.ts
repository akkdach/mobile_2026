export interface CheckWorkInWorkOut {
  workIn: WorkIn;
  workOut: WorkOut;
}

interface WorkOut {
  endMile: string;
  endTime: string;
}

interface WorkIn {
  startMile: string;
  startTime: string;
}

export interface CheckWorkInWorkOutInterface {
  mileAge: number;
  orderId: string;
  workCenter: string;
}
