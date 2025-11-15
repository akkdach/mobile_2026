export interface IWorkOrderImageSTD {
  id: number,
  orderType?: string,
  objectType?: string,
  title?: string,
  description?: string,
  mandatory?: number,
  seq: number
}

export interface IWorkOrderImageStdList {
  item: IWorkOrderImageSTD[]
}

export interface IWorkOrderImage {
  id: number,
  seq?: number
  title?: string,
  imgName?: string,
  orderId?: string,
  orderType?: string,
  objectType?: string
}