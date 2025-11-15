export interface WorkQlChecklistInterface {
  type: string;
  checkList: WorkQlChecklistCheckList[];
}

export interface WorkQlChecklistCheckList {
  title: string;
  type: string;
  item: WorkQlChecklistCheckListItem[];
}

export interface WorkQlChecklistCheckListItem {
  title: string;
  type: string;
  field_name: string;
  codeDescription: string;
  checked?: string;
  measure?: string;
  textDescription?: string;
}
