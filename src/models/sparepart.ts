export interface ISparePartBalance {
  code: string;
  name: string;
  quota: number;
  overdue: number;
  balance: number;
  imageUrl: string;
}

export interface ISparePartTransferStore {
  wk_ctr: string;
  sparepartList: ISparePartTransferStoreList[];
}

export interface ISparePartTransferStoreList {
  sparepartCode: string;
  sparepartName: string;
  sparepartQuantity: string;
  sparepartUnit: string;
  imageUrl: string;
}

export interface ISparePartRemaining {
  wk_ctr: string;
  sparepartList: ISparePartRemainingItem[];
}

export interface ISparePartRemainingItem {
  material: string;
  materialDescription: string;
  imageUrl: string;
  quotaStock: string;
  onWithdraw: string;
  znew: string;
}

export interface ISparePartRequestTO {
  lqnum: string;
  lgpla: string;
  matnr: string;
  werks: string;
  lgort: string;
  charg: string;
  meins: string;
  matL_DESC: string;
  oredid: string;
  sparepartImage?: string;
}

export interface ISparePartRequestTO {
  tO_Number: string;
  items: ISparePartRequestTO[];
}

export interface ISparePartRequestTOItem {
  lqnum: string;
  lgpla: string;
  matnr: string;
  werks: string;
  lgort: string;
  charg: string;
  meins: string;
  matL_DESC: string;
  oredid: string;
  imageUrl?: string
}

export interface ISparePartTO {
  wk_ctr: string;
  sparepartList: ISparePartTOItem[];
}

export interface ISparePartTOItem {
  wk_ctr: string;
  sparepartCode: string;
  sparepartName: string;
  sparepartQuantity: string;
  sparepartUnit: string;
  toNumber: string;
  notShow?: boolean
  checked?: any
  lastData?: boolean
}
