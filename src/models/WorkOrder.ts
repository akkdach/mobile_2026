export interface IWorkOrder {
    day: string,
    orders: IWorkOrderOrder[]
}

export interface IWorkOrderFilter {
    orders: IWorkOrderOrderFilter[]
}
  
export interface IWorkOrderOrder {
    orderId: string
    type: string
    orderType?: string
    objType: string
    pmtype: string
    logo: boolean
    description: string
    dateFinish: string
    timeFinish: string
    account: string
    equipment: string
    colorStatus: string
    orderTypeDescription: string
    billNo: string
    isConnectivity: boolean
    errorMessage: string | null
    customerId:string,
    countDownTimeLimit: any
    webStatus: string
    productioN_START_DATE_TIME:string
    productioN_FINISH_DATE_TIME:string
    scheduE_START_DATE_TIME:string
    scheduE_FINISH_DATE_TIME:string
    slA_START_DATE:string
    slA_FINISH_DATE:string

}

export interface IWorkOrderOrderFilter {
    orderId: string
    type: string
    orderType?: string
    objType: string
    logo: boolean
    description: string
    dateFinish: string
    timeFinish: string
    account: string
    equipment: string
    colorStatus: string
    orderTypeDescription: string
    billNo: string
    isConnectivity: boolean
    errorMessage: string | null
    customerId:string,
    countDownTimeLimit: any
    webStatus: string
    day: string
}