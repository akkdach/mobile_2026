export interface IWorkOrderHistory {
    orderId: string
    order_type : string
    notiDate: string
    finishDate?: string
    notiShortText: string
    equipment: string
    notiProblem: string
    notiCause: string
    notiAct: string
    historySparePart: IWorkOrderSparepartHistory[]
}

export interface IWorkOrderSparepartHistory {
    material: string
    materialDescription: string
    quantity: number
    unit: number
}