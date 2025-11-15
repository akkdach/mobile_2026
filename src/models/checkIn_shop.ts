export interface CheckInShop {
    workIn: WorkIn;
    workOut: WorkOut;
  }
  
  interface WorkOut {
    endTime: string;
    endMile: string;
    orderId: string;
  }
  
  interface WorkIn {
    startTime: string;
    startMile: string;
    orderId: string;
  }