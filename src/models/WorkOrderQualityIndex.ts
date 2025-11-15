export interface IWorkOrderQualityIndex {
    tests: IQualityIndexInfo
    brix: IQualityIndexInfo
    time: IQualityIndexInfo
    ov: IQualityIndexInfo
    age: IQualityIndexInfo
}

export interface IQualityIndexInfo {
    check: number,
    pass: number,
    percent: number,
    defect: number
    defectValue: any[]
}