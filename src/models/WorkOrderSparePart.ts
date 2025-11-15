// export interface IWorkOrderSparePart {
//     workOrderComponentId: string
//     workOrder: string
//     material: string
//     matlDesc: string
//     requirementQuantity: number
//     requirementQuantityUnit: string
//     moveType: boolean
//     sparepartImage?: string
// }

export interface IWorkOrderSparePartStorage {
    material: string
    matDesc: string
    znew: number
    unit: string
    countRetrive?: number
    add?: boolean
    sparepartImage?: string
}

export interface IWorkOrderSparePart {
  workOrderComponentId: number;
  workOrder?: string
  material: string;
  matlDesc: string;
  requirementQuantity: number;
  requirementQuantityUnit: string;
  sparepartImage: string;
  moveType: boolean;
}

export interface ISparePartRequest {
  material: string;
  materialDescription: string;
  quantity: number;
  unit: string;
  sparepartImage?: string
  add?: boolean
  countRetrive?: number
  maxQuantity?: number
  imageUrl?: string,
  index:number
}

export interface ISparePartRequestHD{
  reS_ID:number;
  moveE_PLANT:string
  movE_STLOC:string
  MOVE_TYPE?:string
  orderid?:string
  reS_DATE:string
  weB_STATUS?:string
  reservatioN_NO?:string
  wK_CTR:string
  froM_VAN:string
  isApprove:string
}

export interface ISparePartRequestItem{
  qty:number
  material:string
  des:string
  unit:string
  orderid?:string
  plant?:string
  resId:number
  stageLog:string
  img?:string
  balance?:any
}

export interface ISparePartRequestItemBalance{
  storagE_LOCATION_STOCK_ID:number
  plant:number
  stgE_LOC: number
  stgE_DESC: string
  material: string
  maT_DESC: string
  quotA_STOCK: number
  oN_WITHDRAW: number
  znew: number
  zrefurb: number
  materialMaster: number
}

