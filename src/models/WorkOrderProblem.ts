export interface IWorkOrderProblem {
  orderId: string;
  equipment: string | null;
  problemItems: IProblem[];
}

export interface IProblem {
  problemCode?: string;
  problemCodeGroup?: string;
  problemText?: string;
  damageCode?: string;
  damageCodeGroup?: string;
  damageText?: string;
  causeCode?: string;
  causeCodeGroup?: string;
  causeText?: string;
  activityCode?: string;
  activityCodeGroup?: string;
  activityText?: string;
  indexPositionProblem?: number;
}

export interface ICatalog {
  group: string;
  items: ICatalogItem[];
}

export interface ICatalogItem {
  code: string;
  shortText: string;
  codeGroup: string;
  parent:string;
}
