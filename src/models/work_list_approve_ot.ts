export interface WorkListApproveOTInterface {
    approveOrderType: ApproveOrderType[]
    approveOTList: ApproveOTList[]
}

export interface ApproveOrderType {
    title: string,
    quota: string,
    actual: string,
    balance: string
}

export interface ApproveOTList {
    orderId: string,
    type: string,
    objType: string,
    equipment: string,
    logo: boolean,
    description: string,
    dateFinish: string,
    timeFinish: string,
    account: string,
    orderTypeDescription: string,
    countDownTimeLimit: string,
    billNo: string,
    customerId: string,
    colorStatus: string,
    vanTech: string,
    reqOT: number
}