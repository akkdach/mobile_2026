export interface IWorkOrderCloseWork {
    workOrder?: string
    speed: string
    politeness: string
    punctual: string
    cleanliness: string
    satisfaction: string
    moderate: string
    remark: string
    customerSignatureUrl?: string
    customerSignatureName?: string
    workerSignatureUrl?: string
    workerSignatureName?: string
    teamLeadSignatureName?: string
    warranty?: string
    workType?: string,
    customeR_Remark:string,
    mobile_Remark:string
}

export interface IWorkOrderVisitInspectorCloseWork {
    workOrder?: string
    remark: string
    customerSignatureUrl?: string
    customerSignatureName?: string
    workerSignatureUrl?: string
    workerSignatureName?: string
    workType?: string
}