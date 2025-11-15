export interface IWorkOrderDetail {
    title: string,
    dateRequest: string,
    notiLongText: string,
    notiIncident: string
    orderId: string,
    cdeCode: string,
    equipment: string,
    objType: string,
    equipmentPick: string,
    model: string,
    billNo: string,
    customerName: string
    componentList: IWorkOrderDetailComponentList[]
}

export interface IWorkOrderDetailComponentList  {
  sparePartNo: string
  material: string
  requirementQuantity: number
  requirementQuantityUnit: string
}
export interface IWorkOrderSparepartDetail {
    sparePartNo: string | null
    material: string | null
    requirementQuantity: number | null
    requirementQuantityUnit: string | null
    warrantyCheck: string | null
    price: number | null
}

export interface ISalePriceDetail {
  total: string;
  orderId: string;
  totalAmount: string;
  vat: string;
  items: ISalePriceDetailItem[];
}

export interface ISalePriceDetailItem {
  item: number;
  material: string;
  order: string;
  unit: string;
  description: string;
  vat: string;
  netPrice: string;
  currency: string;
}